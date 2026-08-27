import { RowDataPacket } from "mysql2";

export interface UserInfo extends RowDataPacket {
  username: string,
  language: string,
  light_mode: string,
}