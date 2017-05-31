// Imports
import * as co from 'co';
import * as mongo from 'mongodb';

// Imports interfaces
import { IPermissionRepository } from './../permission';

// Imports models
import { Permission } from './../../models/permission';

export class PermissionRepository implements IPermissionRepository {

    constructor(private uri: string) {

    }

    public create(permission: Permission): Promise<boolean> {
        const self = this;

        return co(function*() {
            const db: mongo.Db = yield mongo.MongoClient.connect(self.uri);

            const collection: mongo.Collection = db.collection('permissions');

            yield collection.insertOne({
                id: permission.id,
                name: permission.name
            });

            db.close();

            return true;
        });
    }

    public update(permission: Permission): Promise<boolean> {
        const self = this;

        return co(function*() {
            const db: mongo.Db = yield mongo.MongoClient.connect(self.uri);

            const collection: mongo.Collection = db.collection('permissions');

            yield collection.updateOne({
                id: permission.id
            },
            {
                name: permission.name
            });

            db.close();

            return true;
        });
    }

    public findById(id: string): Promise<Permission> {
        const self = this;

        return co(function*() {
            const db: mongo.Db = yield mongo.MongoClient.connect(self.uri);

            const collection: mongo.Collection = db.collection('permissions');

            const permission: any = yield collection.findOne({
                id
            });

            db.close();

            return Permission.mapPermission(permission);
        });
    }

    public list(): Promise<Permission[]> {
        const self = this;

        return co(function*() {
            const db: mongo.Db = yield mongo.MongoClient.connect(self.uri);

            const collection: mongo.Collection = db.collection('permissions');

            const permissions: any[] = yield collection.find({}).toArray();

            db.close();

            return permissions.map((x) => Permission.mapPermission(x));
        });
    }
}
