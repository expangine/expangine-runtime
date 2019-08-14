import { DateType } from '../types/Date';
import { BooleanType } from '../types/Boolean';
import { ManyType } from '../types/Many';
import { NumberType } from '../types/Number';
import { TextType } from '../types/Text';
import { EnumType } from '../types/Enum';
export declare const DateOps: {
    now: import("..").OperationBuilder<DateType, typeof DateType, never, never, never, never>;
    today: import("..").OperationBuilder<DateType, typeof DateType, never, never, never, never>;
    tomorrow: import("..").OperationBuilder<DateType, typeof DateType, never, never, never, never>;
    yesterday: import("..").OperationBuilder<DateType, typeof DateType, never, never, never, never>;
    parse: import("..").OperationBuilder<DateType, typeof DateType, {
        value: ManyType;
    }, {
        parseAsUTC: typeof BooleanType;
    }, never, never>;
    fromText: import("..").OperationBuilder<DateType, typeof DateType, {
        value: typeof TextType;
    }, never, never, never>;
    fromTimestamp: import("..").OperationBuilder<DateType, typeof DateType, {
        value: typeof NumberType;
    }, never, never, never>;
    fromTimestampSeconds: import("..").OperationBuilder<DateType, typeof DateType, {
        value: typeof NumberType;
    }, never, never, never>;
    min: import("..").OperationBuilder<DateType, typeof DateType, {
        value: typeof DateType;
        test: typeof DateType;
    }, never, never, never>;
    max: import("..").OperationBuilder<DateType, typeof DateType, {
        value: typeof DateType;
        test: typeof DateType;
    }, never, never, never>;
    get: import("..").OperationBuilder<DateType, typeof NumberType, {
        value: typeof DateType;
        property: EnumType;
    }, never, never, never>;
    set: import("..").OperationBuilder<DateType, typeof DateType, {
        value: typeof DateType;
        property: EnumType;
        set: typeof NumberType;
    }, never, never, never>;
    add: import("..").OperationBuilder<DateType, typeof DateType, {
        value: typeof DateType;
        unit: EnumType;
    }, {
        amount: typeof NumberType;
    }, never, never>;
    sub: import("..").OperationBuilder<DateType, typeof DateType, {
        value: typeof DateType;
        unit: EnumType;
    }, {
        amount: typeof NumberType;
    }, never, never>;
    startOf: import("..").OperationBuilder<DateType, typeof DateType, {
        value: typeof DateType;
        unit: EnumType;
    }, never, never, never>;
    endOf: import("..").OperationBuilder<DateType, typeof DateType, {
        value: typeof DateType;
        unit: EnumType;
    }, {
        inclusive: typeof BooleanType;
    }, never, never>;
    daysInMonth: import("..").OperationBuilder<DateType, typeof NumberType, {
        value: typeof DateType;
    }, never, never, never>;
    daysInYear: import("..").OperationBuilder<DateType, typeof NumberType, {
        value: typeof DateType;
    }, never, never, never>;
    weeksInYear: import("..").OperationBuilder<DateType, typeof NumberType, {
        value: typeof DateType;
    }, never, never, never>;
    copy: import("..").OperationBuilder<DateType, typeof DateType, {
        value: typeof DateType;
    }, never, never, never>;
    cmp: import("..").OperationBuilder<DateType, typeof NumberType, {
        value: typeof DateType;
        test: typeof DateType;
    }, {
        unit: EnumType;
    }, never, never>;
    diff: import("..").OperationBuilder<DateType, typeof NumberType, {
        value: typeof DateType;
        test: typeof DateType;
    }, {
        unit: EnumType;
        absolute: typeof BooleanType;
        adjust: EnumType;
    }, never, never>;
    timezoneOffset: import("..").OperationBuilder<DateType, typeof NumberType, {
        value: typeof DateType;
    }, never, never, never>;
    toText: import("..").OperationBuilder<DateType, typeof TextType, {
        value: typeof DateType;
        format: typeof TextType;
    }, never, never, never>;
    toISOText: import("..").OperationBuilder<DateType, typeof TextType, {
        value: typeof DateType;
    }, never, never, never>;
    isEqual: import("..").OperationBuilder<DateType, typeof BooleanType, {
        value: typeof DateType;
        test: typeof DateType;
    }, {
        unit: EnumType;
    }, never, never>;
    isBefore: import("..").OperationBuilder<DateType, typeof BooleanType, {
        value: typeof DateType;
        test: typeof DateType;
    }, {
        unit: EnumType;
    }, never, never>;
    isBeforeOrEqual: import("..").OperationBuilder<DateType, typeof BooleanType, {
        value: typeof DateType;
        test: typeof DateType;
    }, {
        unit: EnumType;
    }, never, never>;
    isAfter: import("..").OperationBuilder<DateType, typeof BooleanType, {
        value: typeof DateType;
        test: typeof DateType;
    }, {
        unit: EnumType;
    }, never, never>;
    isAfterOrEqual: import("..").OperationBuilder<DateType, typeof BooleanType, {
        value: typeof DateType;
        test: typeof DateType;
    }, {
        unit: EnumType;
    }, never, never>;
    isBetween: import("..").OperationBuilder<DateType, typeof BooleanType, {
        value: typeof DateType;
        start: typeof DateType;
        end: typeof DateType;
    }, {
        unit: EnumType;
        startInclusive: typeof BooleanType;
        endInclusive: typeof BooleanType;
    }, never, never>;
    isStartOf: import("..").OperationBuilder<DateType, typeof BooleanType, {
        value: typeof DateType;
        unit: EnumType;
    }, never, never, never>;
    isEndOf: import("..").OperationBuilder<DateType, typeof BooleanType, {
        value: typeof DateType;
        unit: EnumType;
    }, {
        inclusive: typeof BooleanType;
    }, never, never>;
    isDST: import("..").OperationBuilder<DateType, typeof BooleanType, {
        value: typeof DateType;
    }, never, never, never>;
    isLeapYear: import("..").OperationBuilder<DateType, typeof BooleanType, {
        value: typeof DateType;
    }, never, never, never>;
};
