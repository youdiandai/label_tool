#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
__title__ = ''
__author__ = 'changxin'
__mtime__ = '2019/1/17'
"""
from PIL import Image
import os
import shutil
import random
import zipfile
from redis import Redis
from ..log import logger
from flask import current_app
import hashlib
from datetime import datetime
import json


class ImageUpload:
    """
    用户上传图片时用到的类
    """

    @staticmethod
    def create_redis_conn():
        conn = Redis()
        try:
            conn.ping()
        except Exception:
            return Redis(host="redis")
        else:
            return conn

    def __init__(self, user_id: int):
        self.conn = ImageUpload.create_redis_conn()
        self.user_id = user_id

    @staticmethod
    def create_tmp():
        """
        创建临时文件夹
        :return:
        """
        base_url = os.path.join(current_app.config['UPLOADPATH'], 'upload_tmp')
        if os.path.exists(base_url):
            pass
        else:
            os.mkdir(base_url)

    def create_utmp(self):
        """
        创建用户文件夹
        :return:
        """
        url = os.path.join(current_app.config['UPLOADPATH'], 'upload_tmp', str(self.user_id))
        if os.path.exists(url):
            return url
        else:
            os.mkdir(url)
            return url

    def save_tfile(self, f):
        """
        将文件名保存在redis中并保存文件到临时路径下
        :param f:
        :return:
        """
        new_fname = hashlib.md5(
            (f.filename.split('.')[0] + datetime.now().strftime("%s")).encode('utf-8')).hexdigest() + '.' + \
                    f.filename.split('.')[-1]
        _t = self.conn.hget("label_tool", str(self.user_id))
        if _t:
            t = json.loads(_t)
        else:
            t = []
        t.append((f.filename, new_fname))
        ImageUpload.create_tmp()
        user_url = self.create_utmp()
        f.save(os.path.join(user_url, new_fname))
        self.conn.hset("label_tool", str(self.user_id), json.dumps(t))

    def delete_file(self, name):
        """
        删除文件
        :param name:文件名
        :return:
        """
        files = self.get_files()
        for x in range(len(files)):
            if files[x][0] == name:
                files = files[:x] + files[x + 1:]
                break
        self.conn.hset("label_tool", str(self.user_id), json.dumps(files))

    def reset(self):
        """
        在redis中清空文件
        :return:
        """
        result = remove_folder(os.path.join(current_app.config['UPLOADPATH'], 'upload_tmp', str(self.user_id)))
        self.conn.hdel("label_tool", str(self.user_id))

    def get_files(self):
        """
        从redis获取用户上传的文件名列表
        :return:
        """
        return json.loads(self.conn.hget("label_tool", str(self.user_id)))


def remove_folder(path):
    if not os.path.exists(path):
        logger.info('目录%s不存在，不需要删除' % path)
        return True
    else:
        try:
            files = os.listdir(path)
            for x in files:
                os.remove(os.path.join(path, x))
            os.removedirs(path)
            logger.info('目录%s已经删除' % path)
            return True
        except Exception:
            return False


def make_xml_son_el(doc, name, father, text=None):
    """
    添加xml子节点
    :param doc:
    :param name:
    :param father:
    :param text:
    :return:
    """
    son = doc.createElement(name)
    if text:
        text_node = doc.createTextNode(str(text))
        son.appendChild(text_node)
    father.appendChild(son)
    return son


def save_xml(doc, path):
    """
    保存xml
    :param doc:
    :param path:
    :return:
    """
    with open(path, 'w') as f:
        doc.writexml(f, indent='\t', newl='\n', addindent='\t', encoding='utf-8')


def get_pic_info(path):
    """
    获取图片信息
    :param path:
    :return:
    """
    _img = Image.open(path)
    width, height = _img.size
    channel = 1
    if _img.mode == "RGB":
        channel = 3
    return width, height, channel


def mycopyfile(srcfile, dstfile):
    """
    复制文件
    :param srcfile:
    :param dstfile:
    :return:
    """
    if not os.path.isfile(srcfile):
        logger.info("%s not exist!" % (srcfile))
    else:
        fpath, fname = os.path.split(dstfile)  # 分离文件名和路径
        if not os.path.exists(fpath):
            os.makedirs(fpath)  # 创建路径
        shutil.copyfile(srcfile, dstfile)  # 复制文件
        logger.info("copy %s -> %s" % (srcfile, dstfile))


def split_data(full_list: list, train: int, test: int):
    """
    拆分数据
    :param full_list:
    :param train:
    :param test:
    :return:
    """
    random.shuffle(full_list)
    _train = int(len(full_list) * (train / 100))
    _test = _train + int(len(full_list) * (test / 100))
    return full_list[:_train], full_list[_train:_test], full_list[_test:]


def zipDir(dirpath, outFullName):
    """
    压缩指定文件夹
    :param dirpath: 目标文件夹路径
    :param outFullName: 压缩文件保存路径+xxxx.zip
    :return: 无
    """
    zip = zipfile.ZipFile(outFullName, "w", zipfile.ZIP_DEFLATED)
    for path, dirnames, filenames in os.walk(dirpath):
        # 去掉目标跟路径，只对目标文件夹下边的文件及文件夹进行压缩
        fpath = path.replace(dirpath, '')

        for filename in filenames:
            zip.write(os.path.join(path, filename), os.path.join(fpath, filename))
    zip.close()
