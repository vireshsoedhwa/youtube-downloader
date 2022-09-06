from django.core.management.base import BaseCommand, CommandError
from youtube.models import YoutubeResource
import requests
from pathlib import Path
from django.conf import settings

import re


class Command(BaseCommand):
    help = "Archives the YoutubeResource to Backend Storage"

    def add_arguments(self, parser):
        parser.add_argument("YoutubeResource_ids", nargs="+", type=int)

    def handle(self, *args, **options):
        for yt_id in options["YoutubeResource_ids"]:
            try:
                youtuberesource = YoutubeResource.objects.get(pk=yt_id)
            except YoutubeResource.DoesNotExist:
                raise CommandError(f"YoutubeResource {yt_id} does not exist")

            audiofile = None
            path = Path(
                settings.MEDIA_ROOT
                + str(youtuberesource.youtube_id)
                + "/"
                + youtuberesource.filename
            )
            if not path.is_file():
                raise CommandError(f"YoutubeResource {yt_id} file is missing")

            # check if Done
            if not youtuberesource.status == YoutubeResource.Status.DONE:
                raise CommandError(
                    f"YoutubeResource {yt_id} is not finished processing"
                )

            # check if music
            if not youtuberesource.is_music:
                raise CommandError(f"YoutubeResource {yt_id} is not Music category")

            values = {}

            # check if artist exists
            if youtuberesource.artist == None:
                # check if title exists
                if youtuberesource.title == None:
                    raise CommandError(f"YoutubeResource {yt_id} title is missing")
                else:
                    # check if tags
                    possible_artist = None
                    x = re.search(r"(^.*)-", youtuberesource.title)
                    if x is None:
                        raise CommandError(
                            f"YoutubeResource {yt_id} Could not derive artist from title"
                        )
                    else:
                        possible_artist = x.group(1).strip()
                        if not youtuberesource.tags == None:
                            if possible_artist in youtuberesource.tags:
                                youtuberesource.needs_review = False
                                values["artists"] = possible_artist
                            else:
                                youtuberesource.needs_review = True
                        else:
                            youtuberesource.needs_review = True
            else:
                # artist already recorded. no analysis needed
                youtuberesource.needs_review = False
                values = {"artists": youtuberesource.artist}

            if not youtuberesource.needs_review:
                tags = []
                if not youtuberesource.tags == None:
                    for tag in youtuberesource.tags:
                        tags.append(tag)
                values["tags"] = tags

                url_create = settings.PLAAPI_PATH + "/mediaresources/"
                r1 = requests.post(
                    url_create, files={"audiofile": path.open(mode="rb")}, data=values
                )
                if r1.status_code == requests.codes.created:
                    response_id = r1.json()["id"]

                    self.stdout.write(self.style.SUCCESS("created"))
                    self.stdout.write(self.style.SUCCESS(response_id))
                    # self.stdout.write(self.style.SUCCESS(r2.headers))
                else:
                    raise CommandError(
                        f"YoutubeResource {yt_id} request to api failed with code: {r1.status_code}"
                    )
            else:
                youtuberesource.save()
                raise CommandError(
                    f"YoutubeResource {yt_id} needs review"
                )

            youtuberesource.status = YoutubeResource.Status.ARCHIVED
            youtuberesource.save()

            self.stdout.write(self.style.SUCCESS('Successfully Archived "%s"' % yt_id))
