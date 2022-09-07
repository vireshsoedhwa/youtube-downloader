# Generated by Django 3.2.15 on 2022-09-07 01:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('youtube', '0007_alter_youtuberesource_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='youtuberesource',
            name='status',
            field=models.CharField(choices=[('NEW', 'New'), ('QUEUED', 'Queued'), ('BUSY', 'Busy'), ('FAILED', 'Failed'), ('DONE', 'Done'), ('REVIEW', 'Review'), ('ARCHIVE', 'Archive'), ('ARCHIVED', 'Archived')], default='NEW', max_length=15),
        ),
    ]