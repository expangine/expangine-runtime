import { Runtime } from '../../Runtime';
import { Command } from '../../Command';
export declare type LiveContext = Record<string, any>;
export declare type LiveResult = any;
export declare type LiveCommand = Command<LiveContext, LiveResult>;
export declare type LiveCommandMap<K extends string | number | symbol = string> = Record<K, LiveCommand>;
export declare const runtime: Runtime<Record<string, any>, any>;
