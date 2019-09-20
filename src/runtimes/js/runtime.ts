
import { Runtime } from '../../Runtime';
import { defs } from '../../def';
import { Command } from '../../Command';


export type LiveContext = Record<string, any>;

export type LiveResult = any;

export type LiveCommand = Command<LiveContext, LiveResult>;

export type LiveCommandMap<K extends string | number | symbol = string> = Record<K, LiveCommand>;

export const runtime = new Runtime<LiveContext, LiveResult>(defs);
