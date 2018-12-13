#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
__title__ = ''
__author__ = 'changxin'
__mtime__ = '2018/5/15'
"""
import os
from app import create_app, db
from app.models import Users, Projects, ProjectTypes, Photos, Labels, Points, Folders, MarkTypes
from flask_script import Manager, Shell
from flask_migrate import Migrate, MigrateCommand

app = create_app(os.getenv('FLASK_CONFIG') or 'default')
manager = Manager(app)
migrate = Migrate(app, db)


def make_shell_context():
    return dict(app=app,
                Users=Users,
                Projects=Projects,
                ProjectTypes=ProjectTypes,
                Photos=Photos,
                Labels=Labels,
                Points=Points,
                Folders=Folders,
                MarkTypes=MarkTypes,
                db=db)


manager.add_command('shell', Shell(make_context=make_shell_context))
manager.add_command('db', MigrateCommand)

if __name__ == '__main__':
    manager.run()
