import { Realm } from "../interfaces/realm.interface";
import cultivationJson from "../constants/cultivation-realms.json";

export const realms: Realm[] = [cultivationJson] as unknown as Realm[];
