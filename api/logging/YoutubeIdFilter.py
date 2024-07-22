import logging


class YoutubeIdFilter(logging.Filter):
    def __init__(self, youtuberesource=None):
        self.youtuberesource = youtuberesource

    def filter(self, record):
        if self.youtuberesource is None:
            record.id = "--"
            record.youtubeid = "--"
        else:
            record.id = self.youtuberesource.id
            record.youtubeid = self.youtuberesource.youtube_id
        return True