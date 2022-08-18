import os
import logging 


class YoutubeIdFilter(logging.Filter):
    def __init__(self, youtuberesource):
        self.youtuberesource = youtuberesource       
    
    def filter(self, record):
        record.id = self.youtuberesource.id
        record.youtubeid = self.youtuberesource.youtube_id
        return True
