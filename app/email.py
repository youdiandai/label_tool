#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
__title__ = ''
__author__ = 'changxin'
__mtime__ = '2018/5/15'
"""
from threading import Thread
from flask import render_template, current_app
from flask_mail import Message
from . import mail
"""用来发送邮件"""


def send_async_email(app, msg):
    with app.app_context():
        mail.send(msg)


def send_email(to, subject, template, message):
    """输入收件人，主题，和要使用的渲染模板后发送邮件"""
    app = current_app._get_current_object()
    msg = Message(app.config['MAIL_SUBJECT_PREFIX'] + ' ' + subject,
                  sender=app.config['MAIL_SENDER'], recipients=[to])
    msg.body = render_template('/mail/' + template + '.txt', message=message)
    msg.html = render_template('/mail/' + template + '.html', message=message)
    thr = Thread(target=send_async_email, args=[app, msg])
    thr.start()
    return thr