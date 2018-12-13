#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
__title__ = ''
__author__ = 'changxin'
__mtime__ = '2018/5/15'
"""
from . import main
from flask import render_template, jsonify, request, send_from_directory, abort, redirect, url_for
from ..models import Photos, Projects, ProjectTypes, LabelTypes, Labels, Folders, MarkTypes
from app import db
import re
from flask_login import current_user, login_required
import os
import json
from ..models import save_xml, zipDir

check_re = '20[0-9]{12,}'
patient_id_re = '[0-9]{5,6}-[0-9]'
allow_ext_lower = ['jpg', 'jpeg', 'png', 'bmp', 'dcm', 'ima']
allow_ext = allow_ext_lower + [x.upper() for x in allow_ext_lower]


@main.before_app_first_request
def create_data():
    """
    在项目第一次被访问时进行类型的初始化
    :return:
    """
    if len(MarkTypes.query.all()) == 0:
        MarkTypes('粘膜上')
        MarkTypes('粘膜下')
    if len(LabelTypes.query.all()) == 0:
        LabelTypes("花")
        LabelTypes("鸟")
        LabelTypes("鱼")
        LabelTypes("虫")
    type1 = ProjectTypes.query.filter_by(name='图像分类').first()
    if not type1:
        ProjectTypes(id=1, name='图像分类')
    type2 = ProjectTypes.query.filter_by(name='位置标注').first()
    if not type2:
        ProjectTypes(id=2, name='位置标注')
    type3 = ProjectTypes.query.filter_by(name='文字标注').first()
    if not type3:
        ProjectTypes(id=3, name='文字标注')


@main.route('/')
@login_required
def project():
    """
    项目管理页面
    :return:
    """
    page = request.args.get('page', 1, type=int)
    pagination = current_user.projects.paginate(page, per_page=10, error_out=False)
    projects = pagination.items
    _str = str
    return render_template('project.html', projects=projects, _str=_str, pagination=pagination)


@main.route('/folders/<int:project_id>')
@login_required
def folders(project_id):
    """
    文件夹管理页面
    :param project_id:
    :return:
    """
    project = Projects.query.get_or_404(project_id)
    if project.user_id != current_user.id:
        abort(403)
    page = request.args.get('page', 1, type=int)
    pagination = Folders.query.filter_by(project_id=project_id).paginate(page, per_page=10, error_out=False)
    folders = pagination.items
    return render_template('folders.html', id=project_id, folders=folders, pagination=pagination)


@main.route('/tool/<int:folder_id>')
@login_required
def tool(folder_id):
    """
    进行标记的页面
    :param folder_id:
    :return:
    """
    folder = Folders.query.get_or_404(folder_id)
    if folder.user_id != current_user.id:
        abort(403)
    if folder.project.project_type.name == '图像分类':
        mark_types = folder.project.mark_types.all()
        return render_template('TooLV1.3.html', folder=folder, mark_types=mark_types)
    elif folder.project.project_type.name == '位置标注':
        label_types = folder.project.label_types.all()
        return render_template("Too_position.html", folder=folder, label_types=label_types)


@main.route('/create_project', methods=['POST'])
@login_required
def create_project():
    """
    创建项目的路由
    :return:
    """
    json = request.get_json()
    project_type = ProjectTypes.query.filter_by(name=json['project_type']).first().id
    pro_name = json['project_name']
    types = json['types']
    pro = Projects(name=pro_name, project_type_id=project_type, user_id=current_user.id)
    if project_type == ProjectTypes.query.filter_by(name="图像分类").first().id:
        if types is '':
            pro.mark_types.append(MarkTypes.query.filter_by(name='粘膜上').first())
            pro.mark_types.append(MarkTypes.query.filter_by(name='粘膜下').first())
            db.session.add(pro)
            db.session.commit()
        else:
            for x in re.split('[,，]', types):
                tmp_type = MarkTypes.query.filter_by(name=x).first()
                mark_type = tmp_type if tmp_type is not None else MarkTypes(x)
                pro.mark_types.append(mark_type)
                db.session.add(pro)
        db.session.commit()
    elif project_type == ProjectTypes.query.filter_by(name="位置标注").first().id:
        if types is '':
            pro.label_types.append(LabelTypes.query.filter_by(name="花").first())
            pro.label_types.append(LabelTypes.query.filter_by(name="鸟").first())
            pro.label_types.append(LabelTypes.query.filter_by(name="鱼").first())
            pro.label_types.append(LabelTypes.query.filter_by(name="虫").first())
            db.session.add(pro)
        else:
            for x in re.split('[,，]', types):
                tmp_type = LabelTypes.query.filter_by(name=x).first()
                label_type = tmp_type if tmp_type is not None else LabelTypes(x)
                pro.label_types.append(label_type)
                db.session.add(pro)
        db.session.commit()
    return jsonify({'status': 'succ'})


@main.route('/create_folder', methods=['POST'])
@login_required
def create_folder():
    json = request.get_json()
    folder_name = json['folder_name']
    folder_descript = json['folder_descript']
    project_id = json['project_id']
    Folders(folder_name, folder_descript, int(project_id), current_user.id)
    return jsonify({'status': 'succ'})


@main.route('/upload/<int:pro_id>', methods=['POST'])
@login_required
def upload(pro_id):
    """
    上传文件夹并保存图片
    :param pro_id:
    :return:
    """
    project = Projects.query.get_or_404(pro_id)
    if project.user_id != current_user.id:
        abort(403)
    tmp = request.files.getlist('file')[0].filename
    folder_name = tmp.split('/')[0]
    photo_name = tmp.split('/')[1]
    folder = Folders(folder_name, pro_id, current_user.id)
    img_num = {'num': 0, 'uploaded': 0}
    print("共上传图片：{} 张".format(request.files.getlist('file')))
    for x in request.files.getlist('file'):
        img_num['num'] = img_num['num'] + 1
        ext = x.filename.split('.')[1]
        if ext in allow_ext:
            Photos(x, folder.id)
            img_num['uploaded'] = img_num['uploaded'] + 1
    return jsonify(img_num)


@main.route('/img/<int:photo_id>')
@login_required
def img(photo_id):
    """
    提供图片的路由
    :param photo_id:
    :return:
    """
    image = Photos.query.get(photo_id)
    return send_from_directory(image.folder.url, image.url.split('/')[-1])


@main.route('/mark/<int:photo_id>', methods=['POST'])
@login_required
def mark(photo_id):
    """
    标记图片
    :param photo_id:
    :return:
    """
    photo = Photos.query.get_or_404(photo_id)
    photo.mark_type_id = request.get_json()
    photo.marked = True
    db.session.add(photo)
    db.session.commit()
    return jsonify({'status': 'succ'})


@main.route('/folder/mark_count/<int:folder_id>')
def mark_count(folder_id: int):
    folder = Folders.query.get_or_404(folder_id)
    return jsonify({'marked': folder.photos.filter_by(marked=True).count(), '_count': folder.photos.count(),
                    'images': [{'name': x.name.split('/')[1], 'marked': x.marked,
                                'type': x.mark_type.name if x.marked else '未设置'} for x in
                               folder.photos.all()], 'txt_url': url_for('main.export_txt', folder_id=folder_id)})


@main.route('/folder/label_count/<int:folder_id>')
def label_count(folder_id: int):
    folder = Folders.query.get_or_404(folder_id)
    return jsonify({'labeled': folder.photos.filter_by(labeled=True).count(), '_count': folder.photos.count(),
                    'images': [{'name': x.name.split('/')[1], 'labeled': x.labeled,
                                'labels': x.labels_data} for x in folder.photos.all()]})


@main.route('/download/export_txt/<int:folder_id>')
def export_txt(folder_id: int):
    folder = Folders.query.get_or_404(folder_id)
    comparison = [(x.name.split('/')[1], x.mark_type.name if x.marked else '未设置') for x in folder.photos.all()]
    with open(os.path.join(folder.url, 'export.txt'), "w") as f:
        for x in comparison:
            f.write(x[0] + " " + x[1] + '\n')
    return send_from_directory(folder.url, 'export.txt', as_attachment=True)


@main.route('/download/export_xml/<int:folder_id>')
def export_xml(folder_id: int):
    folder = Folders.query.get_or_404(folder_id)
    export_path = folder.create_export_path()
    for x in folder.photos.filter_by(labeled=True).all():
        photo_name = x.name.split('/')[1].split('.')[0] + '.' + 'xml'
        save_xml(x.get_xml('xml', photo_name), os.path.join(export_path, photo_name))
    if os.path.exists(os.path.join(folder.url, 'export_xml.zip')):
        os.remove(os.path.join(folder.url, 'export_xml.zip'))
    print(export_path)
    zipDir(export_path, os.path.join(folder.url, 'export_xml.zip'))
    return send_from_directory(folder.url, 'export_xml.zip', as_attachment=True)


@main.route('/label/<int:photo_id>', methods=['POST'])
@login_required
def label(photo_id: int):
    """
    给图片增加label
    :param photo_id:
    :return:
    """
    data = request.get_json()
    print(data)
    data = request.values.to_dict()
    print(data)
    photo = Photos.query.get_or_404(photo_id)
    labels_data = json.loads(data['labels'])
    print(labels_data)
    for x in labels_data:
        _label = Labels(x['name'], photo_id, x['x'], x['y'], x['height'], x['width'])
        _label.label_type_id = int(x['label_type'])
    photo.labeled = True
    db.session.add(photo)
    db.session.commit()
    return jsonify({'status': 'successful'})


@main.route('/export/<int:project_id>', methods=["GET", "POST"])
@login_required
def export(project_id: int):
    data = request.get_json()
    print(data)
    project = Projects.query.get_or_404(project_id)
    train = int(data['train'])
    test = int(data['test'])
    val = 100 - (train + test)
    zip_name = project.export_data(train, test, val)
    return send_from_directory(project.url, zip_name, as_attachment=True)


@main.route('/export_by_url/<int:project_id>/<int:train>/<int:test>', methods=["GET", "POST"])
@login_required
def export_by_url(project_id: int, train: int, test: int):
    project = Projects.query.get_or_404(project_id)
    val = 100 - (train + test)
    zip_name = project.export_data(train, test, val)
    return send_from_directory(project.url, zip_name, as_attachment=True)


@main.route('/delete/project/<int:project_id>')
def delete_project(project_id: int):
    project = Projects.query.get_or_404(project_id)
    project.delete()
    return redirect(url_for('.project'))


@main.route('/delete/folder/<int:folder_id>')
def delete_folder(folder_id: int):
    folder = Folders.query.get_or_404(folder_id)
    folder.delete()
    return redirect(url_for('main.folders', project_id=folder.project_id))


@main.route('/tool_position/')
def tool_position():
    return render_template('Too_position.html')
