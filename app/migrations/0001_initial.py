# Generated by Django 3.2.18 on 2023-03-26 13:41

import app.models
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='YoutubeResource',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('youtube_id', models.TextField(max_length=200, unique=True)),
                ('url', models.TextField(blank=True, max_length=500, null=True)),
                ('audiofile', models.FileField(blank=True, max_length=200, null=True, upload_to=app.models.file_directory_path)),
                ('videofile', models.FileField(blank=True, max_length=200, null=True, upload_to=app.models.file_directory_path)),
                ('status', models.CharField(choices=[('NEW', 'New'), ('QUEUED', 'Queued'), ('BUSY', 'Busy'), ('FAILED', 'Failed'), ('DONE', 'Done')], default='NEW', max_length=15)),
                ('progress', models.DecimalField(blank=True, decimal_places=0, default=0, max_digits=3)),
                ('eta', models.DecimalField(blank=True, decimal_places=0, default=0, max_digits=15)),
                ('elapsed', models.DecimalField(blank=True, decimal_places=0, default=0, max_digits=15)),
                ('speed', models.DecimalField(blank=True, decimal_places=0, default=0, max_digits=15)),
                ('error', models.TextField(blank=True, max_length=500, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
