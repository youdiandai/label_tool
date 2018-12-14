#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
__title__ = ''
__author__ = 'changxin'
__mtime__ = '2018/5/15'
"""
from . import auth
from flask import redirect, url_for, render_template, session, request
from .forms import LoginForm
from flask_login import current_user, login_user, logout_user, login_required
from app.models import Users
from app import db


@auth.route('/login', methods=['POST', 'GET'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('main.index'))
    if request.method == 'POST':
        username = request.values.get('username')
        password = request.values.get('password')
        user = Users.query.filter_by(username=username).first()
        if user is not None and user.verify_password(password):
            login_user(user, True)
            return redirect(url_for('main.project'))
    return render_template('auth/login.html')


@auth.route('/register', methods=['POST', 'GET'])
def register():
    if request.method == 'POST':
        username = request.values.get('username')
        password = request.values.get('password')
        user = Users.query.filter_by(username=username).first()
        if user:
            return render_template('auth/register_fail.html', message='用户已经存在')
        else:
            user = Users(username, password)
            return render_template('auth/register_succ.html')
    return render_template('auth/register.html')


@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('.login'))
