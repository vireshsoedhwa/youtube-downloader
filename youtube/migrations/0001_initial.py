# Generated by Django 3.2.16 on 2022-10-29 06:01

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
                ('youtube_url', models.TextField(blank=True, max_length=500, null=True)),
                ('title', models.TextField(blank=True, default='', max_length=200, null=True)),
                ('description', models.TextField(blank=True, max_length=5000, null=True)),
                ('genre', models.TextField(blank=True, max_length=100, null=True)),
                ('filename', models.TextField(blank=True, max_length=100, null=True)),
                ('is_playlist', models.BooleanField(default=False)),
                ('is_music', models.BooleanField(default=False)),
                ('artist', models.TextField(blank=True, max_length=100, null=True)),
                ('tags', models.JSONField(blank=True, null=True)),
                ('categories', models.JSONField(blank=True, null=True)),
                ('status', models.CharField(choices=[('NEW', 'New'), ('QUEUED', 'Queued'), ('BUSY', 'Busy'), ('FAILED', 'Failed'), ('DONE', 'Done'), ('REVIEW', 'Review'), ('ARCHIVE', 'Archive'), ('ARCHIVED', 'Archived')], default='NEW', max_length=15)),
                ('downloadprogress', models.DecimalField(blank=True, decimal_places=0, default=0, max_digits=3)),
                ('eta', models.DecimalField(blank=True, decimal_places=0, default=0, max_digits=5)),
                ('elapsed', models.DecimalField(blank=True, decimal_places=0, default=0, max_digits=5)),
                ('speed', models.DecimalField(blank=True, decimal_places=0, default=0, max_digits=10)),
                ('error', models.TextField(blank=True, max_length=500, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
