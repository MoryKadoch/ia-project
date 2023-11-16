class DBRouter:
    extension_db = "extension"
    default_db = "train"

    route_extension_models = ['extension', 'stat']

    def db_for_read(self, model, **hints):
        model_name = model._meta.model_name
        if model_name in self.route_extension_models:
            return self.extension_db
        else:
            return "train"

    def db_for_write(self, model, **hints):
        model_name = model._meta.model_name
        if model_name in self.route_extension_models:
            return 'extension'
        else:
            return "train"

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        if model_name in self.route_extension_models:
            return db == 'extension'
        else:
            return db == "train"