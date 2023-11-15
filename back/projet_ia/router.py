class DBRouter:
    extension_db = "extension"
    default_db = "default"

    def db_for_read(self, model, **hints):
        model_name = model._meta.model_name
        if model_name == 'extension' or model_name =='stat':
            return self.extension_db
        else:
            return None

    def db_for_write(self, model, **hints):
        model_name = model._meta.model_name
        if model_name == 'extension' or model_name== 'stat':
            return 'extension'
        else:
            return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        if model_name == 'extension' or model_name == 'stat':
            return db == 'extension'
        else:
            return db == 'default'