#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
__title__ = ''
__author__ = 'changxin'
__mtime__ = '2018/5/15'
"""
import hashlib
import os
from datetime import datetime

from flask import current_app
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

from flask_login import AnonymousUserMixin
from app import db, login_manager
from uuid import uuid4
import shutil
import math

from xml.dom.minidom import Document
from .tools import make_xml_son_el, save_xml, get_pic_info, mycopyfile, split_data, zipDir

allow_ext_lower = ['jpg', 'jpeg', 'png', 'bmp', 'dcm', 'ima']
allow_ext = allow_ext_lower + [x.upper() for x in allow_ext_lower]

project_marktypes = db.Table('project_recordtypes',
                             db.Column('project_id', db.Integer, db.ForeignKey('projects.id')),
                             db.Column('mark_type_id', db.Integer, db.ForeignKey('mark_types.id')))

project_labeltypes = db.Table('project_labeltypes',
                              db.Column('project_id', db.Integer, db.ForeignKey('projects.id')),
                              db.Column('label_type_id', db.Integer, db.ForeignKey('label_types.id')))


# 用户表
class Users(UserMixin, db.Model):
    """User table"""
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, index=True)
    password_hash = db.Column(db.String(128))
    member_since = db.Column(db.DateTime, default=datetime.utcnow())

    projects = db.relationship('Projects', backref='user', lazy='dynamic')
    folders = db.relationship('Folders', backref='user', lazy='dynamic')
    photos = db.relationship('Photos', backref='user', lazy='dynamic')

    @property
    def password(self):
        raise AttributeError('password is not a readable attribute')

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        """
        验证密码
        :param password:
        :return:
        """
        return check_password_hash(self.password_hash, password)

    def __init__(self, username, password):
        self.username = username
        self.password = password
        db.session.add(self)
        db.session.commit()

    def __repr__(self):
        return '<User> id="{}" username="{}"'.format(self.id, self.username)


class Projects(db.Model):
    """project tables"""
    __tablename__ = "projects"
    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String(128))
    name = db.Column(db.String(20))
    create_time = db.Column(db.DateTime, default=datetime.utcnow())

    folders = db.relationship('Folders', backref='project', lazy='dynamic')
    photos = db.relationship('Photos', backref='project', lazy='dynamic')

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    project_type_id = db.Column(db.Integer, db.ForeignKey('project_types.id'))
    original = db.Column(db.Boolean, default=True)

    # 多对多
    mark_types = db.relationship('MarkTypes', secondary=project_marktypes,
                                 backref=db.backref('mark_types', lazy='dynamic'),
                                 lazy='dynamic')

    label_types = db.relationship('LabelTypes', secondary=project_labeltypes,
                                  backref=db.backref('label_types', lazy='dynamic'),
                                  lazy='dynamic')

    def __repr__(self):
        return '<Project {}>'.format(self.id)

    def delete(self):
        if os.path.exists(self.url):
            for x in list(os.walk(self.url)):
                for y in x[2]:
                    os.remove(os.path.join(x[0], y))
            shutil.rmtree(self.url)
        for x in self.folders.all():
            x.delete()
        db.session.delete(self)
        db.session.commit()

    def get_num_type_dict(self):
        """
        :return:{"类名"：标记位}
        """
        types = self.mark_types.all()
        type_names = [x.name for x in types]
        _tmp = zip(type_names, range(len(type_names)))
        return {x[0]: x[1] for x in _tmp}

    def export_data_local(self, train: int, test: int, val: int = None):
        """
        导出图像
        :param train:训练集比例
        :param test: 测试集比例
        :param val: 验证集比例
        :return:文件路径
        """
        if not val:
            if train + test != 100:
                raise Exception
        elif train + test + val != 100:
            raise Exception
        self.create_export_path(True if val else False)
        marked_photo = None
        if self.project_type.name == '图像分类':
            marked_photo = self.photos.filter_by(marked=True).all()
        elif self.project_type.name == '位置标注':
            marked_photo = self.photos.filter_by(labeled=True).all()
        comparison = self.get_num_type_dict()
        _export_tuples = []
        for x in range(len(marked_photo)):
            y = marked_photo[x]
            if self.project_type.name == '图像分类':
                _export_tuples.append(
                    (y.url, y.new_name(math.log10(len(marked_photo)), x), comparison[y.mark_type.name]))
            elif self.project_type.name == '位置标注':
                _export_tuples.append(
                    (y.url, y.new_name(math.log10(len(marked_photo)), x), None, y))
        _train, _test, _val = split_data(_export_tuples, train, test)
        if self.project_type.name == '图像分类':
            with open(os.path.join(self.url, 'tmp', 'comparison.txt'), "w") as f:
                for x in comparison:
                    f.write(x + " " + str(comparison[x]) + '\n')
        if self.project_type.name == '图像分类':
            with open(os.path.join(self.url, 'tmp', 'train.txt'), "w") as f:
                for x in _train:
                    f.write(x[1] + " " + str(x[2]) + '\n')
                    mycopyfile(x[0], os.path.join(self.url, 'tmp', 'train', x[1]))
        elif self.project_type.name == '位置标注':
            for x in _train:
                mycopyfile(x[0], os.path.join(self.url, 'tmp', 'train', x[1]))
                img_xml_name = x[1].split('.')[0] + '.' + 'xml'
                save_xml(x[-1].get_xml('train', img_xml_name),
                         os.path.join(self.url, 'tmp', 'xml', 'train', img_xml_name))
        if _test:
            if self.project_type.name == '图像分类':
                with open(os.path.join(self.url, 'tmp', 'test.txt'), "w") as f:
                    for x in _test:
                        f.write(x[1] + " " + str(x[2]) + '\n')
                        mycopyfile(x[0], os.path.join(self.url, 'tmp', 'test', x[1]))
        elif self.project_type.name == '位置标注':
            for x in _test:
                mycopyfile(x[0], os.path.join(self.url, 'tmp', 'test', x[1]))
                img_xml_name = x[1].split('.')[0] + '.' + 'xml'
                save_xml(x[-1].get_xml('test', img_xml_name),
                         os.path.join(self.url, 'tmp', 'xml', 'test', img_xml_name))
        if val:
            if self.project_type.name == '图像分类':
                with open(os.path.join(self.url, 'tmp', 'val.txt'), "w") as f:
                    for x in _val:
                        f.write(x[1] + " " + str(x[2]) + '\n')
                        mycopyfile(x[0], os.path.join(self.url, 'tmp', 'val', x[1]))
        elif self.project_type.name == '位置标注':
            for x in _val:
                mycopyfile(x[0], os.path.join(self.url, 'tmp', 'val', x[1]))
                img_xml_name = x[1].split('.')[0] + '.' + 'xml'
                save_xml(x[-1].get_xml('test', img_xml_name),
                         os.path.join(self.url, 'tmp', 'xml', 'test', img_xml_name))
        zipDir(os.path.join(self.url, 'tmp'), os.path.join(self.url, 'export.zip'))
        return os.path.join(self.url, 'export.zip')

    def export_data(self, train: int, test: int, val: int = None):
        """
        导出图片
        :param train:训练集比例
        :param test: 测试集比例
        :param val: 验证集比例
        :return: 压缩文件名
        """
        if not val:
            if train + test != 100:
                raise Exception
        elif train + test + val != 100:
            raise Exception
        self.create_export_path(True if val else False)
        marked_photo = None
        if self.project_type.name == '图像分类':
            marked_photo = self.photos.filter_by(marked=True).all()
        elif self.project_type.name == '位置标注':
            marked_photo = self.photos.filter_by(labeled=True).all()
        comparison = self.get_num_type_dict()
        _export_tuples = []
        for x in range(len(marked_photo)):
            y = marked_photo[x]
            if self.project_type.name == '图像分类':
                _export_tuples.append(
                    (y.url, y.new_name(math.log10(len(marked_photo)), x), comparison[y.mark_type.name]))
            elif self.project_type.name == '位置标注':
                _export_tuples.append(
                    (y.url, y.new_name(math.log10(len(marked_photo)), x), None, y))
        _train, _test, _val = split_data(_export_tuples, train, test)
        if self.project_type.name == '图像分类':
            with open(os.path.join(self.url, 'tmp', 'comparison.txt'), "w") as f:
                for x in comparison:
                    f.write(x + " " + str(comparison[x]) + '\n')
        if self.project_type.name == '图像分类':
            with open(os.path.join(self.url, 'tmp', 'train.txt'), "w") as f:
                for x in _train:
                    f.write(x[1] + " " + str(x[2]) + '\n')
                    mycopyfile(x[0], os.path.join(self.url, 'tmp', 'train', x[1]))
        elif self.project_type.name == '位置标注':
            for x in _train:
                mycopyfile(x[0], os.path.join(self.url, 'tmp', 'train', x[1]))
                img_xml_name = x[1].split('.')[0] + '.' + 'xml'
                save_xml(x[-1].get_xml('train', x[1]),
                         os.path.join(self.url, 'tmp', 'xml', 'train', img_xml_name))
        if _test:
            if self.project_type.name == '图像分类':
                with open(os.path.join(self.url, 'tmp', 'test.txt'), "w") as f:
                    for x in _test:
                        f.write(x[1] + " " + str(x[2]) + '\n')
                        mycopyfile(x[0], os.path.join(self.url, 'tmp', 'test', x[1]))
            elif self.project_type.name == '位置标注':
                for x in _test:
                    mycopyfile(x[0], os.path.join(self.url, 'tmp', 'test', x[1]))
                    img_xml_name = x[1].split('.')[0] + '.' + 'xml'
                    save_xml(x[-1].get_xml('test', x[1]),
                             os.path.join(self.url, 'tmp', 'xml', 'test', img_xml_name))
        if val:
            if self.project_type.name == '图像分类':
                with open(os.path.join(self.url, 'tmp', 'val.txt'), "w") as f:
                    for x in _val:
                        f.write(x[1] + " " + str(x[2]) + '\n')
                        mycopyfile(x[0], os.path.join(self.url, 'tmp', 'val', x[1]))
            elif self.project_type.name == '位置标注':
                for x in _val:
                    mycopyfile(x[0], os.path.join(self.url, 'tmp', 'val', x[1]))
                    img_xml_name = x[1].split('.')[0] + '.' + 'xml'
                    save_xml(x[-1].get_xml('val', x[1]),
                             os.path.join(self.url, 'tmp', 'xml', 'val', img_xml_name))
        zip_name = uuid4().hex[:6] + '.zip'
        zipDir(os.path.join(self.url, 'tmp'), os.path.join(self.url, zip_name))
        return zip_name

    def create_export_path(self, val=False):
        """
        创建用于导出的路径，如果已经存在，先删除原有的路径
        :return:
        """
        export_path = os.path.join(self.url, 'tmp')
        if os.path.exists(export_path):
            for root, dirs, files in os.walk(export_path):
                for x in files:
                    os.remove(os.path.join(root, x))
            shutil.rmtree(export_path)
        os.mkdir(export_path)
        os.mkdir(os.path.join(export_path, 'train'))
        os.mkdir(os.path.join(export_path, 'test'))
        if self.project_type.name == '位置标注':
            os.mkdir(os.path.join(export_path, 'xml'))
            os.mkdir(os.path.join(export_path, 'xml', 'train'))
            os.mkdir(os.path.join(export_path, 'xml', 'test'))
        if val:
            os.mkdir(os.path.join(export_path, 'val'))
            if self.project_type.name == '位置标注':
                os.mkdir(os.path.join(export_path, 'xml', 'val'))

    def create_project_folder(self):
        """
        创建项目文件夹
        :return: 项目文件夹路径
        """
        projectname_hash = hashlib.md5(self.name.encode('utf-8')).hexdigest()
        project_url = os.path.join(current_app.config['UPLOADPATH'], projectname_hash)
        if not os.path.exists(current_app.config['UPLOADPATH']):
            try:
                os.mkdir(current_app.config['UPLOADPATH'])
            except:
                return None
        if not os.path.exists(project_url):
            try:
                os.mkdir(project_url)
                return project_url
            except:
                return None
        else:
            return project_url

    def remove_project_folder(self):
        """
        删除项目文件夹
        :return:True or false
        """
        if not os.path.exists(current_app.config['UPLOADPATH']):
            return True
        elif not os.path.exists(self.url):
            return True
        else:
            try:
                os.remove(self.url)
                if not os.path.exists(self.url):
                    return True
            except:
                return False

    def __init__(self, name, user_id=None, project_type_id=None, tmp=False, **kwargs):
        super(Projects, self).__init__(**kwargs)
        self.name = name
        self.user_id = user_id
        self.project_type_id = project_type_id
        if not tmp:
            self.url = self.create_project_folder()
            if self.url is None:
                raise Exception
        else:
            self.original = False
        db.session.add(self)
        db.session.commit()


class ProjectTypes(db.Model):
    """project type tables"""
    __tablename__ = "project_types"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20))
    create_time = db.Column(db.DateTime, default=datetime.utcnow())

    projects = db.relationship('Projects', backref='project_type', lazy='dynamic')

    def __repr__(self):
        return '<ProjectTypes {}>'.format(self.id)

    def __init__(self, id, name, **kwargs):
        super(ProjectTypes, self).__init__(**kwargs)
        self.id = id
        self.name = name
        db.session.add(self)
        db.session.commit()


class Folders(db.Model):
    """folder tables"""
    __tablename__ = "folders"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), nullable=True)
    url = db.Column(db.String(256))
    create_time = db.Column(db.DateTime, default=datetime.utcnow())

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))

    photos = db.relationship('Photos', backref='folder', lazy='dynamic')

    def delete(self):
        if os.path.exists(self.url):
            for x in list(os.walk(self.url)):
                for y in x[2]:
                    os.remove(os.path.join(x[0], y))
            shutil.rmtree(self.url)
        for x in self.photos.all():
            x.delete()
        db.session.delete(self)
        db.session.commit()

    def __repr__(self):
        return '<Folder {}>'.format(self.id)

    def create_folder_folder(self, project_id):
        folder_hash = hashlib.md5(self.name.encode('utf-8')).hexdigest()
        project_url = Projects.query.get_or_404(project_id).url
        folder_url = os.path.join(project_url, folder_hash)
        if not os.path.exists(current_app.config['UPLOADPATH']):
            return None
        if not os.path.exists(project_url):
            os.mkdir(project_url)
        if os.path.exists(folder_url):
            return folder_url
        else:
            try:
                os.mkdir(folder_url)
                return folder_url
            except:
                return None

    def remove_record_folder(self):
        folder_path = self.url
        if not os.path.exists(folder_path):
            return True
        else:
            try:
                os.removedirs(folder_path)
                return True
            except:
                return False

    def create_export_path(self):
        """
        创建用于导出的路径，如果已经存在，先删除原有的路径
        :return:
        """
        export_path = os.path.join(self.url, 'xml')
        if os.path.exists(export_path):
            for root, dirs, files in os.walk(export_path):
                for x in files:
                    os.remove(os.path.join(root, x))
            shutil.rmtree(export_path)
        os.mkdir(export_path)
        return export_path

    def __init__(self, name, project_id, user_id=None, **kwargs):
        """

        :param name:
        :param patient_id: 指的是病人在数据库里的主键
        :param user_id:
        :param record_type_id:
        :param kwargs:
        """
        super(Folders, self).__init__(**kwargs)
        self.name = name
        self.user_id = user_id
        self.project_id = project_id
        self.url = self.create_folder_folder(self.project_id)
        db.session.add(self)
        db.session.commit()


class MarkTypes(db.Model):
    """mark type table"""
    __tables__ = "mark_types"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), nullable=True, unique=True)
    create_time = db.Column(db.DateTime, default=datetime.utcnow())

    photos = db.relationship('Photos', backref='mark_type', lazy='dynamic')

    def __repr__(self):
        return '<RecordTypes {}>'.format(self.id)

    def __init__(self, name, **kwargs):
        super(MarkTypes, self).__init__(**kwargs)
        self.name = name
        db.session.add(self)
        db.session.commit()


class Photos(db.Model):
    """photo table"""
    __tablename__ = "photos"
    id = db.Column(db.Integer, primary_key=True)
    labeled = db.Column(db.Boolean, default=False)
    name = db.Column(db.String(128))
    url = db.Column(db.String(256))
    create_time = db.Column(db.DateTime, default=datetime.utcnow())
    marked = db.Column(db.Boolean, nullable=True, default=False)

    width = db.Column(db.Float, nullable=True)
    height = db.Column(db.Float, nullable=True)
    channel = db.Column(db.Integer, nullable=True)

    # 一对多关系中作为多的
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    folder_id = db.Column(db.Integer, db.ForeignKey('folders.id'))
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))
    mark_type_id = db.Column(db.Integer, db.ForeignKey('mark_types.id'))

    # 一对多关系中作为一的
    labels = db.relationship('Labels', backref='photo', lazy='dynamic')

    def get_xml(self, folder, filename):
        doc = Document()
        root = doc.createElement('annotation')
        doc.appendChild(root)
        make_xml_son_el(doc, 'folder', root, folder)
        make_xml_son_el(doc, 'filename', root, filename)
        size = make_xml_son_el(doc, 'size', root)
        make_xml_son_el(doc, 'width', size, self.width)
        make_xml_son_el(doc, 'height', size, self.height)
        make_xml_son_el(doc, 'depth', size, self.channel)
        for x in self.labels.all():
            obj = make_xml_son_el(doc, 'object', root)
            make_xml_son_el(doc, 'name', obj, x.label_type.name)
            make_xml_son_el(doc, 'pose', obj, 'Unspecified')
            make_xml_son_el(doc, 'truncated', obj, '0')
            make_xml_son_el(doc, 'difficult', obj, '0')
            bndbox = make_xml_son_el(doc, 'bndbox', obj)
            make_xml_son_el(doc, 'xmin', bndbox, x.x)
            make_xml_son_el(doc, 'xmax', bndbox, x.x + x.width)
            make_xml_son_el(doc, 'ymin', bndbox, x.y - x.height)
            make_xml_son_el(doc, 'ymax', bndbox, x.y)
        return doc

    @property
    def labels_data(self):
        return [x.data for x in self.labels.all()]

    def __init__(self, filename, new_name, folder_id, **kwargs):
        super(Photos, self).__init__(**kwargs)
        self.name = filename
        self.folder_id = folder_id
        folder = Folders.query.get_or_404(folder_id)
        self.url = os.path.join(folder.url, new_name)
        self.user_id = folder.user_id
        self.project_id = folder.project_id
        width, height, channel = get_pic_info(self.url)
        self.width = width
        self.height = height
        self.channel = channel
        db.session.add(self)
        db.session.commit()

    def delete(self):
        if os.path.exists(self.url):
            os.remove(self.url)
        db.session.delete(self)
        db.session.commit()

    def new_name(self, _length: int, _id: int):
        """
        用于在导出时获取新文件名
        :param _length:导出的图片名字的长度
        :param _id:该图片时第几张图片
        :return:
        """
        _length = _length if _length > 5 else 5
        _format_str = '{:0>' + str(_length) + 'd}'
        return '{name}.{ext}'.format(name=_format_str.format(_id), ext=self.url.split('.')[-1])

    def __repr__(self):
        return '<Photos {}>'.format(self.id)


class Labels(db.Model):
    """label table"""
    __tablename__ = "labels"
    id = db.Column(db.Integer, primary_key=True)
    describe = db.Column(db.String(20), nullable=True)
    create_time = db.Column(db.DateTime, default=datetime.utcnow())

    x = db.Column(db.Float, nullable=True)
    y = db.Column(db.Float, nullable=True)
    height = db.Column(db.Float, nullable=True)
    width = db.Column(db.Float, nullable=True)

    photo_id = db.Column(db.Integer, db.ForeignKey('photos.id'))

    points = db.relationship('Points', backref='label', lazy='dynamic')

    label_type_id = db.Column(db.Integer, db.ForeignKey('label_types.id'))

    @property
    def data(self):
        return {
            'label_type': self.label_type.name,
            'name': self.describe,
            'x': self.x,
            'y': self.y,
            'height': self.height,
            'width': self.width
        }

    def __repr__(self):
        return '<Labels {},number of point:{}>'.format(self.id, self.points.count())

    def __init__(self, describe, photo_id, x, y, height, width, **kwargs):
        super(Labels, self).__init__(**kwargs)
        self.describe = describe
        self.photo_id = photo_id
        self.x = x
        self.y = y
        self.height = height
        self.width = width
        photo = Photos.query.get_or_404(photo_id)
        photo.labeled = True
        db.session.add(self)
        db.session.add(photo)
        db.session.commit()


class LabelTypes(db.Model):
    """label type table"""
    __tables__ = "label_types"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), nullable=True, unique=True)
    create_time = db.Column(db.DateTime, default=datetime.utcnow())
    labels = db.relationship('Labels', backref='label_type', lazy='dynamic')

    def __repr__(self):
        return '<RecordTypes {}>'.format(self.id)

    def __init__(self, name, **kwargs):
        super(LabelTypes, self).__init__(**kwargs)
        self.name = name
        db.session.add(self)
        db.session.commit()


class Points(db.Model):
    """points table"""
    __tablename__ = "points"
    id = db.Column(db.Integer, primary_key=True)
    x = db.Column(db.Float, nullable=False)
    y = db.Column(db.Float, nullable=False)
    height = db.Column(db.Float, nullable=False)
    width = db.Column(db.Float, nullable=False)
    create_time = db.Column(db.DateTime, default=datetime.utcnow())

    label_id = db.Column(db.Integer, db.ForeignKey('labels.id'))

    @property
    def data(self):
        return {'x': self.x, 'y': self.y, 'height': self.height, 'width': self.width}

    def __repr__(self):
        return '<Points {} x:{},y:{}>'.format(self.id, self.x, self.y)

    def __init__(self, x, y, height, width, label_id: int, **kwargs):
        super(Points, self).__init__(**kwargs)
        self.x = x
        self.y = y
        self.height = height
        self.width = width
        self.label_id = label_id
        db.session.add(self)
        db.session.commit()


@login_manager.user_loader
def load_user(user_id):
    return Users.query.get(int(user_id))


class AnonymousUser(AnonymousUserMixin):
    def can(self, permissions):
        return False

    def is_administrator(self):
        return False


login_manager.anonymous_user = AnonymousUser
