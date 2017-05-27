export class UserPermission {

    public static mapUserPermission(x: any): UserPermission {
        return new UserPermission(x.id, x.name);
    }

    constructor(public id: string, public name: string) {

    }
}
