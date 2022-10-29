import logging

class LoggingAdapter(logging.LoggerAdapter):
    def process(self, msg, kwargs):
        id = ""
        if 'id' in self.extra:
            id = str(self.extra['id'])
        return f"[{id} {msg}]"