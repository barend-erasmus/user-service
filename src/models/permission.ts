export class Permission {

    public static mapPermission(x: Permission) {
        return new Permission(x.id, x.name);
    }

    constructor(public id: string, public name: string) {

    }
}
