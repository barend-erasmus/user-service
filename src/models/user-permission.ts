export class UserPermission {
    constructor(public id: string, public name: string) {

    }

    public static mapUserPermission(x: any): UserPermission {
        return new UserPermission(x.id, x.name);
    }
}
