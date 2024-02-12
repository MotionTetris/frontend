import { RigidBody } from "@dimforge/rapier2d";

export class Wall {
    private _rigidBody: RigidBody;
    public userData: any;

    public constructor(rigidBody: RigidBody) {
        this._rigidBody = rigidBody
    }

    public get rigidBody() {
        return this._rigidBody;
    }
}