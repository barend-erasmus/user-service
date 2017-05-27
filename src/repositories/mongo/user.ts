// Imports
import * as co from 'co';
import * as mongo from 'mongodb';

// Imports interfaces
import { IUserRepository } from './../user';

// Imports models
import { User } from './../../models/user';

export class UserRepository implements IUserRepository {

    constructor(private uri: string) {

    }

    public create(user: User): Promise<boolean> {
        const self = this;

        return co(function*() {
            const db: mongo.Db = yield mongo.MongoClient.connect(self.uri);

            const collection: mongo.Collection = db.collection('users');

            yield collection.insertOne({
                emailAddress: user.emailAddress,
                id: user.id,
                isVerified: user.isVerified,
                lastLoginTimestamp: user.lastLoginTimestamp,
                permissions: user.permissions.map((x) => {
                    return {
                        id: x.id,
                        name: x.name
                    };
                }),
                roles: user.roles.map((x) => {
                    return {
                        id: x.id,
                        name: x.name,
                        permissions: x.permissions.map((x) => {
                            return {
                                id: x.id,
                                name: x.name
                            };
                        })
                    };
                }),
                username: user.username,
            });

            db.close();

            return true;
        });
    }

    public update(user: User): Promise<boolean> {
        const self = this;

        return co(function*() {
            const db: mongo.Db = yield mongo.MongoClient.connect(self.uri);

            const collection: mongo.Collection = db.collection('users');

            yield collection.updateOne({
                id: user.id,
            },
                {
                    emailAddress: user.emailAddress,
                    isVerified: user.isVerified,
                    lastLoginTimestamp: user.lastLoginTimestamp,
                    permissions: user.permissions.map((x) => {
                        return {
                            id: x.id,
                            name: x.name
                        };
                    }),
                    roles: user.roles.map((x) => {
                        return {
                            id: x.id,
                            name: x.name,
                            permissions: x.permissions.map((x) => {
                                return {
                                    id: x.id,
                                    name: x.name
                                };
                            })
                        };
                    }),
                    username: user.username,
                });

            db.close();

            return true;
        });
    }

    public list(): Promise<User[]> {
        const self = this;

        return co(function*() {
            const db: mongo.Db = yield mongo.MongoClient.connect(self.uri);

            const collection: mongo.Collection = db.collection('users');

            const users: any[] = yield collection.find({}).toArray();

            db.close();

            return users.map((x) => User.mapUser(x));
        });
    }

    public findByUsername(username: string): Promise<User> {
        const self = this;

        return co(function*() {
            const db: mongo.Db = yield mongo.MongoClient.connect(self.uri);

            const collection: mongo.Collection = db.collection('users');

            const user: any = yield collection.findOne({
                username
            });

            db.close();

            return User.mapUser(user);
        });
    }

}
