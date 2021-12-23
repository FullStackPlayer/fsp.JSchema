const {JType, vjs, SchemaTypes, JSchemaBase} = require('../../dist/cjs/JSchema.js')
const {assertError, assertEquals, tryCatch} = require("./Tools.js")

// 测试 JType 对象的封装
test('JType Constructor', () => {
    // 未指定类型
    assertError(()=>{
        new JType({})
    },
    '[SchemaDefError@JType:constructor]: Invalid Schema Type Name - [unset]')
    // 指定了不合规的类型
    assertError(()=>{
        new JType({
            type: 'notExists'
        })
    },
    '[SchemaDefError@JType:constructor]: Invalid Schema Type Name - [notExists]')
    // 正常类型
    let jt = new JType({
        type: 'string'
    })
    assertEquals(jt.type, SchemaTypes.STRING)
})

// 测试 required 属性
test("JSchema Property [required]", () => {
    const typeStr = 'string'
    let res = true
    // 非必须
    tryCatch(()=>{
        return vjs(undefined,{
            type: typeStr
        })
    })
    res = vjs(undefined,{
        type: typeStr
    })
    assertEquals(res, true)
    res = vjs(null,{
        type: typeStr
    })
    assertEquals(res, true)
    res = vjs(null,{
        required: false,
        type: typeStr
    })
    assertEquals(res, true)
    // required 字段数据类型错误
    assertError(()=>{
        res = vjs(null,{
            required: '',
            type: typeStr
        })
    },
    `[ValidationError@vjs://validate:string]: Validation Failed <= [SchemaDefError@vjs://validate:string/required]: Invalid Schema Key, should be a boolean, but we got '""'`)
    // 不满足时的报错
    assertError(()=>{
        res = vjs(undefined,{
            required: true,
            type: typeStr
        })
    },
    `[ValidationError@vjs://validate:string]: Validation Failed <= [TargetMissingError@vjs://validate:string/required]: Target Required, but we got 'undefined'`)
    assertError(()=>{
        res = vjs(null,{
            required: true,
            type: typeStr
        })
    },
    `[ValidationError@vjs://validate:string]: Validation Failed <= [TargetMissingError@vjs://validate:string/required]: Target Required, but we got 'null'`)
});

// 测试 string 类型
test("JSchema Type [string]", () => {
    const typeStr = 'string'
    let schema = {
        type: typeStr
    }
    let res = true
    // 其它类型
    {
        const typeErrInfo = '[ValidationError@vjs://validate:string]: Validation Failed <= [StringValidationError@vjs://validate:string]: String Validation Failed <= [TargetTypeError@vjs://validate:string]: Wrong Type'
        assertError(()=>{
            return vjs(123,schema)
        },typeErrInfo)
        assertError(()=>{
            return vjs(true,schema)
        },typeErrInfo)
        assertError(()=>{
            return vjs(new Date(),schema)
        },typeErrInfo)
        assertError(()=>{
            return vjs(function(){},schema)
        },typeErrInfo)
        assertError(()=>{
            return vjs([],schema)
        },typeErrInfo)
        assertError(()=>{
            return vjs({},schema)
        },typeErrInfo)
    }
    // 正常值
    {
        res = vjs('',schema)
        assertEquals(res, true)
        res = vjs('123',schema)
        assertEquals(res, true)
    }
    // 字符串长度
    {
        assertError(()=>{
            return vjs('123',{
                type: typeStr,
                minLength: 3,
                maxLength: 2
            })
        },
        '[ValidationError@vjs://validate:string]: Validation Failed <= [StringValidationError@vjs://validate:string]: String Validation Failed <= [SchemaDefError@vjs://validate:string/minLength&maxLength]: Invalid Schema Rule')
        assertError(()=>{
            return vjs('',{
                type: typeStr,
                minLength: 1
            })
        },
        '[ValidationError@vjs://validate:string]: Validation Failed <= [StringValidationError@vjs://validate:string]: String Validation Failed <= [RestrictionError@vjs://validate:string/minLength|maxLength]: Restriction Not Satisfied')
        assertError(()=>{
            return vjs('123456',{
                type: typeStr,
                maxLength: 5
            })
        },
        '[ValidationError@vjs://validate:string]: Validation Failed <= [StringValidationError@vjs://validate:string]: String Validation Failed <= [RestrictionError@vjs://validate:string/minLength|maxLength]: Restriction Not Satisfied')
        res = vjs('你好',{
            type: typeStr,
            minLength: 2,
            maxLength: 2,
        })
        assertEquals(res, true)
    }
});

// 测试 boolean 类型
test("JSchema Type [boolean]", () => {
    const typeStr = 'boolean'
    let schema = {
        type: typeStr
    }
    let res = true
    // 其它类型
    {
        const typeErrInfo = `[ValidationError@vjs://validate:boolean]: Validation Failed <= [BooleanValidationError@vjs://validate:boolean]: Boolean Validation Failed <= [TargetTypeError@vjs://validate:boolean]: Wrong Type`
        assertError(()=>{
            return vjs(0,schema)
        },typeErrInfo)
        assertError(()=>{
            return vjs(1,schema)
        },typeErrInfo)
        assertError(()=>{
            return vjs('',schema)
        },typeErrInfo)
        assertError(()=>{
            return vjs(123,schema)
        },typeErrInfo)
        assertError(()=>{
            return vjs(new Date(),schema)
        },typeErrInfo)
        assertError(()=>{
            return vjs([],schema)
        },typeErrInfo)
        assertError(()=>{
            return vjs({},schema)
        },typeErrInfo)
    }
    // 正常值
    {
        res = vjs(true,schema)
        assertEquals(res, true)
        res = vjs(false,schema)
        assertEquals(res, true)
    }
});

// 测试 integer 类型
test("JSchema Type [integer]", () => {
    const typeStr = 'integer'
    let schema = {
        type: typeStr
    }
    // 其它类型
    let res = true
    // 其它类型
    {
        const typeErrInfo = '[ValidationError@vjs://validate:integer]: Validation Failed <= [IntegerValidationError@vjs://validate:integer]: Integer Validation Failed <= [TargetTypeError@vjs://validate:integer]: Wrong Type'
        assertError(()=>{
            return vjs('',schema)
        },typeErrInfo)
        assertError(()=>{
            return vjs(123.12,schema)
        },typeErrInfo)
        assertError(()=>{
            return vjs(true,schema)
        },typeErrInfo)
        assertError(()=>{
            return vjs(new Date(),schema)
        },typeErrInfo)
        assertError(()=>{
            return vjs(function(){},schema)
        },typeErrInfo)
        assertError(()=>{
            return vjs([],schema)
        },typeErrInfo)
        assertError(()=>{
            return vjs({},schema)
        },typeErrInfo)
    }
    // 正常值
    {
        res = vjs(123,schema)
        assertEquals(res, true)
        res = vjs(-123,schema)
        assertEquals(res, true)
    }
    // 数值范围
    {
        assertError(()=>{
            return vjs(1,{
                type: typeStr,
                min: 3,
                max: 2
            })
        },
        '[ValidationError@vjs://validate:integer]: Validation Failed <= [IntegerValidationError@vjs://validate:integer]: Integer Validation Failed <= [SchemaDefError@vjs://validate:integer/min&max]: Invalid Schema Rule')
        assertError(()=>{
            return vjs(0,{
                type: typeStr,
                min: 1
            })
        },
        '[ValidationError@vjs://validate:integer]: Validation Failed <= [IntegerValidationError@vjs://validate:integer]: Integer Validation Failed <= [RestrictionError@vjs://validate:integer/min|max]: Restriction Not Satisfied')
        assertError(()=>{
            return vjs(6,{
                type: typeStr,
                max: 5
            })
        },
        '[ValidationError@vjs://validate:integer]: Validation Failed <= [IntegerValidationError@vjs://validate:integer]: Integer Validation Failed <= [RestrictionError@vjs://validate:integer/min|max]: Restriction Not Satisfied')
        res = vjs(2,{
            type: typeStr,
            min: 2,
            max: 2
        })
        assertEquals(res, true)
    }
});

// 测试 number 类型
test("JSchema Type [number]", () => {
    const typeStr = 'number'
    let schema = {
        type: typeStr
    }
    let res = true
    // 其它类型
    {
        const typeErrInfo = '[ValidationError@vjs://validate:number]: Validation Failed <= [NumberValidationError@vjs://validate:number]: Number Validation Failed <= [TargetTypeError@vjs://validate:number]: Wrong Type'
        assertError(()=>{
            return vjs('',schema)
        },typeErrInfo)
        assertError(()=>{
            return vjs(true,schema)
        },typeErrInfo)
        assertError(()=>{
            return vjs(new Date(),schema)
        },typeErrInfo)
        assertError(()=>{
            return vjs(function(){},schema)
        },typeErrInfo)
        assertError(()=>{
            return vjs([],schema)
        },typeErrInfo)
        assertError(()=>{
            return vjs({},schema)
        },typeErrInfo)
    }
    // 正常值
    {
        res = vjs(123.123,schema)
        assertEquals(res, true)
        res = vjs(123,schema)
        assertEquals(res, true)
        res = vjs(-123.123,schema)
        assertEquals(res, true)
        res = vjs(-123,schema)
        assertEquals(res, true)
        res = vjs(2.5,{
            type: typeStr,
            min: 2.5,
            max: 2.5
        })
        assertEquals(res, true)
    }
    // 数值范围
    {
        assertError(()=>{
            return vjs(1.2,{
                type: typeStr,
                min: 3,
                max: 2
            })
        },
        '[ValidationError@vjs://validate:number]: Validation Failed <= [NumberValidationError@vjs://validate:number]: Number Validation Failed <= [SchemaDefError@vjs://validate:number/min&max]: Invalid Schema Rule')
        assertError(()=>{
            return vjs(1.3,{
                type: typeStr,
                min: 1.5
            })
        },
        '[ValidationError@vjs://validate:number]: Validation Failed <= [NumberValidationError@vjs://validate:number]: Number Validation Failed <= [RestrictionError@vjs://validate:number/min|max]: Restriction Not Satisfied')
        assertError(()=>{
            return vjs(5.6,{
                type: typeStr,
                max: 5
            })
        },
        '[ValidationError@vjs://validate:number]: Validation Failed <= [NumberValidationError@vjs://validate:number]: Number Validation Failed <= [RestrictionError@vjs://validate:number/min|max]: Restriction Not Satisfied')
    }
});

// 测试 date 类型
test("JSchema Type [date]", () => {
    const typeStr = 'date'
    let schema = {
        type: typeStr
    }
    let res = true
    // 其它类型
    {
        const typeErrInfo = '[ValidationError@vjs://validate:date]: Validation Failed <= [DateValidationError@vjs://validate:date]: Date Validation Failed <= [TargetTypeError@vjs://validate:date]: Wrong Type'
        assertError(()=>{
            return vjs('',schema)
        },typeErrInfo)
        assertError(()=>{
            return vjs(true,schema)
        },typeErrInfo)
        assertError(()=>{
            return vjs(123,schema)
        },typeErrInfo)
        assertError(()=>{
            return vjs(123.123,schema)
        },typeErrInfo)
        assertError(()=>{
            return vjs(function(){},schema)
        },typeErrInfo)
        assertError(()=>{
            return vjs([],schema)
        },typeErrInfo)
        assertError(()=>{
            return vjs({},schema)
        },typeErrInfo)
    }
    // 正常值
    {
        res = vjs(new Date(),schema)
        assertEquals(res, true)
        res = vjs(new Date(1970,0,0),schema)
        assertEquals(res, true)
    }
    // 数值范围
    {
        assertError(()=>{
            return vjs(new Date(),{
                type: typeStr,
                min: new Date(1999,1,1),
                max: new Date(1999,0,0)
            })
        },
        '[ValidationError@vjs://validate:date]: Validation Failed <= [DateValidationError@vjs://validate:date]: Date Validation Failed <= [SchemaDefError@vjs://validate:date/min&max]: Invalid Schema Rule')
        assertError(()=>{
            return vjs(new Date(),{
                type: typeStr,
                min: new Date(2022,0,0)
            })
        },
        '[ValidationError@vjs://validate:date]: Validation Failed <= [DateValidationError@vjs://validate:date]: Date Validation Failed <= [RestrictionError@vjs://validate:date/min|max]: Restriction Not Satisfied')
        assertError(()=>{
            return vjs(new Date(),{
                type: typeStr,
                max: new Date(2000,0,0)
            })
        },
        '[ValidationError@vjs://validate:date]: Validation Failed <= [DateValidationError@vjs://validate:date]: Date Validation Failed <= [RestrictionError@vjs://validate:date/min|max]: Restriction Not Satisfied')
        res = vjs(new Date(1999,1,1),{
            type: typeStr,
            min: new Date(1999,1,1),
            max: new Date(1999,1,1)
        })
        assertEquals(res, true)
    }
});

// 测试 function 类型
test("JSchema Type [function]", () => {
    const typeStr = 'function'
    let schema = {
        type: typeStr
    }
    let res = true
    // 其它类型
    {
        const typeErrInfo = '[ValidationError@vjs://validate:function]: Validation Failed <= [FunctionValidationError@vjs://validate:function]: Function Validation Failed <= [TargetTypeError@vjs://validate:function]: Wrong Type'
        assertError(()=>{
            return vjs(0,schema)
        },typeErrInfo)
        assertError(()=>{
            return vjs(1,schema)
        },typeErrInfo)
        assertError(()=>{
            return vjs('',schema)
        },typeErrInfo)
        assertError(()=>{
            return vjs(123,schema)
        },typeErrInfo)
        assertError(()=>{
            return vjs(new Date(),schema)
        },typeErrInfo)
        assertError(()=>{
            return vjs([],schema)
        },typeErrInfo)
        assertError(()=>{
            return vjs({},schema)
        },typeErrInfo)
        assertError(()=>{
            return vjs(true,schema)
        },typeErrInfo)
    }
    // 正常值
    {
        const test = function(){}
        res = vjs(function(){},schema)
        assertEquals(res, true)
        res = vjs(()=>{},schema)
        assertEquals(res, true)
        res = vjs(async ()=>{},schema)
        assertEquals(res, true)
        res = vjs(test,schema)
        assertEquals(res, true)
    }
});

// 测试 enum 类型
test("JSchema Type [enum]", () => {
    const typeStr = 'enum'
    let schema = {
        type: typeStr
    }
    let res = true
    // 异常
    {
        // schema 未设置 items
        assertError(()=>{
            return vjs('',schema)
        },
        '[ValidationError@vjs://validate:enum]: Validation Failed <= [EnumValidationError@vjs://validate:enum]: Enum Validation Failed <= [KeyMissingError@vjs://validate:enum/JEnumSchema:constructor]: Schema Key Required - [items]')
        // items 没有元素
        assertError(()=>{
            return vjs('',{
                type: typeStr,
                items: []
            })
        },
        '[ValidationError@vjs://validate:enum]: Validation Failed <= [EnumValidationError@vjs://validate:enum]: Enum Validation Failed <= [SchemaDefError@vjs://validate:enum/JEnumSchema:constructor]: Invalid Schema Key - [items] must be a non-zero-item Array')
        // items 类型错误
        assertError(()=>{
            return vjs('',{
                type: typeStr,
                items: true
            })
        },
        '[ValidationError@vjs://validate:enum]: Validation Failed <= [EnumValidationError@vjs://validate:enum]: Enum Validation Failed <= [SchemaDefError@vjs://validate:enum/JEnumSchema:constructor]: Invalid Schema Key - [items] must be an Array')
        // 没有匹配的 enum 值
        assertError(()=>{
            return vjs('',{
                type: typeStr,
                items: [123,456,true]
            })
        },
        `[ValidationError@vjs://validate:enum]: Validation Failed <= [EnumValidationError@vjs://validate:enum]: Enum Validation Failed <= [RestrictionError@vjs://validate:enum/items]: Not Valid Enum Item - '""'`)
    }
    // 正常值
    {
        res = vjs('123',{
            type: typeStr,
            items: ['123',456,true]
        })
        // 对数组和对象用 JSON.stringify 来进行比较
        assertEquals(res, true)
        res = vjs([1,2,3],{
            type: typeStr,
            items: ['123',456,true,[1,2,3]]
        })
        assertEquals(res, true)
        res = vjs({a:0},{
            type: typeStr,
            items: ['123',456,true,[],{a:0}]
        })
        assertEquals(res, true)
    }
});

// 测试正则表达式
test("JSchema Type [regexp]", () => {
    const typeStr = 'regexp'
    let schema = {
        type: typeStr,
        expression: /d+/
    }
    let res = true
    // 其它类型
    {
        assertError(()=>{
            return vjs(123,schema)
        },
        `[ValidationError@vjs://validate:regexp]: Validation Failed <= [RegExpValidationError@vjs://validate:regexp]: RegExp Validation Failed <= [RestrictionError@vjs://validate:regexp/expression]: RegExp Restriction Not Satisfied - '123'`)
        assertError(()=>{
            return vjs(true,schema)
        },
        `[ValidationError@vjs://validate:regexp]: Validation Failed <= [RegExpValidationError@vjs://validate:regexp]: RegExp Validation Failed <= [RestrictionError@vjs://validate:regexp/expression]: RegExp Restriction Not Satisfied - 'true'`)
        assertError(()=>{
            return vjs(function(){},schema)
        },
        `[ValidationError@vjs://validate:regexp]: Validation Failed <= [RegExpValidationError@vjs://validate:regexp]: RegExp Validation Failed <= [RestrictionError@vjs://validate:regexp/expression]: RegExp Restriction Not Satisfied - 'undefined'`)
        assertError(()=>{
            return vjs([],schema)
        },
        `[ValidationError@vjs://validate:regexp]: Validation Failed <= [RegExpValidationError@vjs://validate:regexp]: RegExp Validation Failed <= [RestrictionError@vjs://validate:regexp/expression]: RegExp Restriction Not Satisfied - '[]'`)
        assertError(()=>{
            return vjs({},schema)
        },
        `[ValidationError@vjs://validate:regexp]: Validation Failed <= [RegExpValidationError@vjs://validate:regexp]: RegExp Validation Failed <= [RestrictionError@vjs://validate:regexp/expression]: RegExp Restriction Not Satisfied - '{}'`)
    }
    // 正常值
    {
        // 数字
        schema.expression = /^[0-9]*$/i
        res = vjs('123',schema)
        assertEquals(res, true)
        // 正数、负数、小数
        schema.expression = /^(\-|\+)?\d+(\.\d+)?$/i
        res = vjs('123',schema)
        assertEquals(res, true)
        res = vjs('-123',schema)
        assertEquals(res, true)
        res = vjs('123.123',schema)
        assertEquals(res, true)
        // 不符合的情况
        assertError(()=>{
            return vjs('汉字',schema)
        },
        `[ValidationError@vjs://validate:regexp]: Validation Failed <= [RegExpValidationError@vjs://validate:regexp]: RegExp Validation Failed <= [RestrictionError@vjs://validate:regexp/expression]: RegExp Restriction Not Satisfied - '"汉字"'`)
        const rule = {
            type: SchemaTypes.REGEXP,
            expression: /^[^\d\s\*\,=>]+[^\s\*\,=>]*([^\d\s\*\,=>]*(=>)?[^\d\s\*\,=>]+[^\s\*\,=>]*)?([\,]{1}[^\d\s\*\,=>]+[^\s\*\,=>]*([^\d\s\*\,=>]*(=>)?[^\d\s\*\,=>]+[^\s\*\,=>]*)?)*$/
        }
        res = vjs('s1=>a1',rule)
        assertEquals(res, true)
        res = vjs('s1=>a1,s2,s3=>a3',rule)
        assertEquals(res, true)
    }
});

// 测试 object 类型
test("JSchema Type [object]", () => {
    const typeStr = 'object'
    let schema = {
        type: typeStr
    }
    let res = true
    // 其它类型
    {
        const typeErrInfo = '[ValidationError@vjs://validate:object]: Validation Failed <= [ObjectValidationError@vjs://validate:object]: Object Validation Failed <= [TargetTypeError@vjs://validate:object]: Wrong Type'
        assertError(()=>{
            return vjs('',schema)
        },typeErrInfo)
        assertError(()=>{
            return vjs(true,schema)
        },typeErrInfo)
        assertError(()=>{
            return vjs(123,schema)
        },typeErrInfo)
        assertError(()=>{
            return vjs(123.123,schema)
        },typeErrInfo)
        assertError(()=>{
            return vjs(function(){},schema)
        },typeErrInfo)
        assertError(()=>{
            return vjs([],schema)
        },typeErrInfo)
        assertError(()=>{
            return vjs(new Date(),schema)
        },typeErrInfo)
    }
    // 正常值
    {
        res = vjs({},schema)
        assertEquals(res, true)
        res = vjs({
            a: 0,
            b: '',
            c: new Date()
        },schema)
        assertEquals(res, true)
        res = vjs({},{
            type: typeStr,
            properties: {}
        })
        assertEquals(res, true)
        // 单层校验
        res = vjs({
            a: true,
            b: 1.2,
            c: '123',
        },{
            type: typeStr,
            properties: {
                a: { type: 'boolean', required: true },
                b: { type: 'number' },
                c: { type: 'string' },
                d: { type: 'object' },
                e: {
                    type: 'enum',
                    items: ['LEVEL-A','LEVEL-B','LEVEL-C','LEVEL-D']
                }
            }
        })
        res = vjs({
            a: true,
            b: 1.2,
            c: '123',
            d: {},
            e: 'LEVEL-A'
        },{
            type: typeStr,
            properties: {
                a: { type: 'boolean' },
                b: { type: 'number' },
                c: { type: 'string' },
                d: { type: 'object' },
                e: {
                    type: 'enum',
                    items: ['LEVEL-A','LEVEL-B','LEVEL-C','LEVEL-D']
                }
            }
        })
        assertEquals(res, true)
        // 默认允许其它字段
        res = vjs({
            a: true,
            b: 1.2,
            c: '123',
            d: {},
            e: new Date()
        },{
            type: typeStr,
            properties: {
                a: { type: 'boolean' },
                b: { type: 'number' },
                c: { type: 'string' },
                d: { type: 'object' },
            }
        })
        assertEquals(res, true)
        // 多层校验
        res = vjs({
            a: true,
            b: 1.2,
            c: '123',
            d: {
                d1: '123',
                d2: new Date()
            }
        },{
            type: typeStr,
            properties: {
                a: { type: 'boolean' },
                b: { type: 'number' },
                c: { type: 'string' },
                d: {
                    type: 'object',
                    properties: {
                        d1: { type: 'string' },
                        d2: { type: 'date' }
                    }
                }
            }
        })
        assertEquals(res, true)
        // oneOf 校验
        const oneOf = {
            type: typeStr,
            properties: {
                a: { type: 'boolean' },
                'b#oneOf': [
                    { type: 'number' },
                    { type: 'string' }
                ],
                c: { type: 'string' },
                d: {
                    type: 'object',
                    properties: {
                        d1: { type: 'string' },
                        d2: { type: 'date' }
                    }
                }
            }
        }
        res = vjs({
            a: true,
            b: 1.2,
            c: '123',
            d: {
                d1: '123',
                d2: new Date()
            }
        },oneOf)
        assertEquals(res, true)
        res = vjs({
            a: true,
            b: '1.2',
            c: '123',
            d: {
                d1: '123',
                d2: new Date()
            }
        },oneOf)
        assertEquals(res, true)
    }
    // 各种不满足的情况
    {
        // 必备字段不存在
        assertError(()=>{
            return vjs({
                a: true,
                b: 1.2,
                d: {
                    d2: new Date()
                }
            },{
                type: typeStr,
                properties: {
                    a: { type: 'boolean' },
                    b: { type: 'number' },
                    c: { type: 'string', required: true },
                    d: {
                        type: 'object',
                        properties: {
                            d1: { type: 'string' },
                            d2: { type: 'date' }
                        }
                    }
                }
            })
        },
        `[ValidationError@vjs://validate:object]: Validation Failed <= [ObjectValidationError@vjs://validate:object]: Object Validation Failed <= [RestrictionError@vjs://validate:object/properties]: Properties Restriction Not Satisfied <= [ValidationError@vjs://validate:object/properties/c/validate:string]: Validation Failed <= [TargetMissingError@vjs://validate:object/properties/c/validate:string/required]: Target Required, but we got 'undefined'`)
        // 字段数形约束条件不满足
        assertError(()=>{
            return vjs({
                a: true,
                b: 1.2,
                c: '123',
                d: {
                    d1: '123',
                    d2: new Date()
                }
            },{
                type: typeStr,
                properties: {
                    a: { type: 'boolean' },
                    b: { type: 'number' },
                    c: { 
                        type: 'string', 
                        required: true,
                        minLength: 5,
                    },
                    d: {
                        type: 'object',
                        properties: {
                            d1: { type: 'string' },
                            d2: { type: 'date' }
                        }
                    }
                }
            })
        },
        `[ValidationError@vjs://validate:object]: Validation Failed <= [ObjectValidationError@vjs://validate:object]: Object Validation Failed <= [RestrictionError@vjs://validate:object/properties]: Properties Restriction Not Satisfied <= [ValidationError@vjs://validate:object/properties/c/validate:string]: Validation Failed <= [StringValidationError@vjs://validate:object/properties/c/validate:string]: String Validation Failed <= [RestrictionError@vjs://validate:object/properties/c/validate:string/minLength|maxLength]: Restriction Not Satisfied`)
        // 不允许其它字段
        assertError(()=>{
            return vjs({
                a: true,
                b: 1.2,
                c: '123',
                d: {},
                e: new Date()
            },{
                type: typeStr,
                properties: {
                    a: { type: 'boolean' },
                    b: { type: 'number' },
                    c: { type: 'string' },
                    d: { type: 'object' },
                },
                additionalProperties: false
            })
        },
        `[ValidationError@vjs://validate:object]: Validation Failed <= [ObjectValidationError@vjs://validate:object]: Object Validation Failed <= [RestrictionError@vjs://validate:object/properties]: Properties Restriction Not Satisfied <= [InvalidPropertyError@vjs://validate:object/properties/e]: Property Not Allowed`)
        // 属性值类型约定
        assertError(()=>{
            return vjs({
                a: true,
                b: 1.2,
                c: '123',
                d: {},
                e: new Date()
            },{
                type: typeStr,
                values: {
                    type: 'integer'
                }
            })
        },
        `[ValidationError@vjs://validate:object]: Validation Failed <= [ObjectValidationError@vjs://validate:object]: Object Validation Failed <= [RestrictionError@vjs://validate:object/values]: Values Validation Failed`)
        assertError(()=>{
            return vjs({
                a: true,
                b: 1.2,
                c: '123',
                d: {},
                e: new Date()
            },{
                type: typeStr,
                values: [{
                    type: 'integer'
                }]
            })
        },
        `[ValidationError@vjs://validate:object]: Validation Failed <= [ObjectValidationError@vjs://validate:object]: Object Validation Failed <= [RestrictionError@vjs://validate:object/values]: Values Validation Failed`)
    }
});

// 测试 array 类型
test("JSchema Type [array]", () => {
    const typeStr = 'array'
    let schema = {
        type: typeStr
    }
    let res = true
    // 其它类型
    {
        const typeErrInfo = '[ValidationError@vjs://validate:array]: Validation Failed <= [ArrayValidationError@vjs://validate:array]: Array Validation Failed <= [TargetTypeError@vjs://validate:array]: Wrong Type'
        assertError(()=>{
            res = vjs('',schema)
        },typeErrInfo)
        assertError(()=>{
            res = vjs(true,schema)
        },typeErrInfo)
        assertError(()=>{
            res = vjs(123,schema)
        },typeErrInfo)
        assertError(()=>{
            res = vjs(123.123,schema)
        },typeErrInfo)
        assertError(()=>{
            res = vjs(function(){},schema)
        },typeErrInfo)
        assertError(()=>{
            res = vjs(new Date(),schema)
        },typeErrInfo)
        assertError(()=>{
            res = vjs({},schema)
        },typeErrInfo)
    }
    // 正常值
    {
        res = vjs([],schema)
        assertEquals(res, true)
        // 同一类型的元素
        res = vjs([1,2,3],{
            type: typeStr,
            items: {
                type: 'integer'
            }
        })
        assertEquals(res, true)
        // 多种类型的元素
        res = vjs([1,2,'3'],{
            type: typeStr,
            items: [
                {
                    type: 'integer'
                },
                {
                    type: 'string'
                }
            ]
        })
        assertEquals(res, true)
        // 模拟fields的复杂规则
        res = vjs(['*','s2=>a2'],{
            type: typeStr,
            items: [
                {
                    type: 'regexp',
                    expression: /^\*{1}$/
                },
                {
                    type: 'regexp',
                    expression: /^[^\d\s\*\,=>]+[^\s\*\,=>]*([^\d\s\*\,=>]*(=>)?[^\d\s\*\,=>]+[^\s\*\,=>]*)?$/
                }
            ]
        })
        assertEquals(res, true)
        // 按照顺序排列的类型要求
        res = vjs([1,'2',false],{
            type: typeStr,
            itemsInOrder: [
                {
                    type: 'integer'
                },
                {
                    type: 'string'
                },
                {
                    type: 'boolean'
                },
            ]
        })
        assertEquals(res, true)
        // 允许额外的元素
        res = vjs([1,'2',false,4],{
            type: typeStr,
            itemsInOrder: [
                {
                    type: 'integer'
                },
                {
                    type: 'string'
                },
                {
                    type: 'boolean'
                },
            ],
            additionalItems: true
        })
        assertEquals(res, true)
    }
    // 各种其他限制
    {
        // 深层次错误
        assertError(()=>{
            return vjs(['*','s2=>a2'],{
                type: typeStr,
                items: [
                    {
                        type: 'regexp',
                        rule: /^\*{1}$/
                    },
                    {
                        type: 'regexp',
                        rule: /^[^\d\s\*\,=>]+[^\s\*\,=>]*([^\d\s\*\,=>]*(=>)?[^\d\s\*\,=>]+[^\s\*\,=>]*)?$/
                    }
                ]
            })
        },
        `[ValidationError@vjs://validate:array]: Validation Failed <= [ArrayValidationError@vjs://validate:array]: Array Validation Failed <= [RestrictionError@vjs://validate:array/items]: Items Restriction Not Satisfied <= [ValidationError@vjs://validate:array/items/validate:regexp]: Validation Failed <= [RegExpValidationError@vjs://validate:array/items/validate:regexp]: RegExp Validation Failed <= [SchemaDefError@vjs://validate:array/items/validate:regexp/scanInputKeys:rule]: Invalid Schema Key - [rule]`)
        // 规则冲突
        assertError(()=>{
            res = vjs([],{
                type: typeStr,
                minItemsCount: 2,
                maxItemsCount: 1
            })
        },
        `[ValidationError@vjs://validate:array]: Validation Failed <= [ArrayValidationError@vjs://validate:array]: Array Validation Failed <= [SchemaDefError@vjs://validate:array/minItemsCount&maxItemsCount]: Invalid Schema Rule`)
        // 元素个数限制
        assertError(()=>{
            res = vjs([1],{
                type: typeStr,
                minItemsCount: 2,
            })
        },
        `[ValidationError@vjs://validate:array]: Validation Failed <= [ArrayValidationError@vjs://validate:array]: Array Validation Failed <= [RestrictionError@vjs://validate:array/minItemsCount|maxItemsCount]: Items Restriction Not Satisfied`)
        assertError(()=>{
            res = vjs([1,2,3],{
                type: typeStr,
                maxItemsCount: 2,
            })
        },
        `[ValidationError@vjs://validate:array]: Validation Failed <= [ArrayValidationError@vjs://validate:array]: Array Validation Failed <= [RestrictionError@vjs://validate:array/minItemsCount|maxItemsCount]: Items Restriction Not Satisfied`)
        // items 和 itemsInOrder 不能同时出现
        assertError(()=>{
            res = vjs([1,2,3],{
                type: typeStr,
                items: {
                    type: 'string',
                    required: true
                },
                itemsInOrder: [{
                    type: 'string',
                    required: true
                }]
            })
        },
        `[ValidationError@vjs://validate:array]: Validation Failed <= [ArrayValidationError@vjs://validate:array]: Array Validation Failed <= [SchemaDefError@vjs://validate:array/items&itemsInOrder]: Invalid Schema Rule, [items] and [itemsInOrder] can't be defined at the same time`)
        // 一种类型限定
        assertError(()=>{
            res = vjs([1,2,3],{
                type: typeStr,
                items: {
                    type: 'string',
                    required: true
                }
            })
        },
        `[ValidationError@vjs://validate:array]: Validation Failed <= [ArrayValidationError@vjs://validate:array]: Array Validation Failed <= [RestrictionError@vjs://validate:array/items]: Items Restriction Not Satisfied <= [ValidationError@vjs://validate:array/items/validate:string]: Validation Failed <= [StringValidationError@vjs://validate:array/items/validate:string]: String Validation Failed <= [TargetTypeError@vjs://validate:array/items/validate:string]: Wrong Type`)
        // 多种类型限定
        assertError(()=>{
            res = vjs([1,2,'3'],{
                type: typeStr,
                items: [
                    {
                        type: 'string',
                        required: true
                    },
                    {
                        type: 'boolean',
                        required: true
                    }
                ]
            })
        },
        `[ValidationError@vjs://validate:array]: Validation Failed <= [ArrayValidationError@vjs://validate:array]: Array Validation Failed <= [RestrictionError@vjs://validate:array/items]: Items Restriction Not Satisfied <= [RestrictionError@vjs://validate:array/items]: Items Validation Failed - Zero Match`)
        // items 类型不正确
        assertError(()=>{
            res = vjs([1,2,3],{
                type: typeStr,
                items: true
            })
        },
        `[ValidationError@vjs://validate:array]: Validation Failed <= [ArrayValidationError@vjs://validate:array]: Array Validation Failed <= [RestrictionError@vjs://validate:array/items]: Items Restriction Not Satisfied <= [GetPropertyValueFailed@vjs://validate:array/items/getValue:items]: Get Property Value Failed - [items] <= [ValidationError@vjs://validate:array/items/getValue:items/validate:object]: Validation Failed <= [ObjectValidationError@vjs://validate:array/items/getValue:items/validate:object]: Object Validation Failed <= [TargetTypeError@vjs://validate:array/items/getValue:items/validate:object]: Wrong Type`)
        // 按顺序限制元素类型
        assertError(()=>{
            res = vjs([1,2],{
                type: typeStr,
                itemsInOrder: [
                    {
                        type: 'string',
                        required: true
                    },
                    {
                        type: 'integer',
                        required: true
                    }
                ]
            })
        },
        `[ValidationError@vjs://validate:array]: Validation Failed <= [ArrayValidationError@vjs://validate:array]: Array Validation Failed <= [RestrictionError@vjs://validate:array/itemsInOrder]: Items Restriction Not Satisfied <= [RestrictionError@vjs://validate:array/itemsInOrder]: Items Validation Failed <= [ValidationError@vjs://validate:array/itemsInOrder/validate:string]: Validation Failed <= [StringValidationError@vjs://validate:array/itemsInOrder/validate:string]: String Validation Failed <= [TargetTypeError@vjs://validate:array/itemsInOrder/validate:string]: Wrong Type`)
        // 不允许多余的元素
        assertError(()=>{
            res = vjs(['1',2,'3'],{
                type: typeStr,
                itemsInOrder: [
                    {
                        type: 'string',
                        required: true
                    },
                    {
                        type: 'integer',
                        required: true
                    }
                ],
                additionalItems: false
            })
        },
        `[ValidationError@vjs://validate:array]: Validation Failed <= [ArrayValidationError@vjs://validate:array]: Array Validation Failed <= [RestrictionError@vjs://validate:array/itemsInOrder]: Items Restriction Not Satisfied <= [RestrictionError@vjs://validate:array/additionalItems]: Additional Items Not Allowed`)
    }
});

// 测试 quotable 类型
test('JSchema Type [quotable]', () => {
    // 递归循环引用
    const schema = new JSchemaBase({
        type: 'quotable',
        schema: '$recursive'
    })
    const refs = {
        recursive: new JSchemaBase({
            type: 'object',
            properties: {
                a: { type: 'string', required: true },
                b: {
                    type: 'quotable',
                    schema: '$recursive'
                }
            },
            additionalProperties: false
        })
    }
    const obj = {
        a: '1',
        b: {
            a: '2',
            b: {
                a: '3',
                b: {
                    a: '',
                }
            }
        }
    }
    let res = vjs(obj,schema,refs)
    assertEquals(res,true)
    // 出错
    {
        const quotable = new JSchemaBase({
            type: 'string',
            minLength: 3,
            required: true
        })
        // 忘记 $ 引用符
        assertError(()=>{
            vjs('',{
                type: 'quotable',
                schema: 'quotable'
            },{
                quotable
            })
        },
        `[ValidationError@vjs://validate:quotable]: Validation Failed <= [QuotableValidationError@vjs://validate:quotable]: Quotable Validation Failed <= [SchemaDefError@vjs://validate:quotable/schema]: Invalid Schema Key - [schema] must be a string starts with '$'`)
        // 找不到引用对象
        assertError(()=>{
            vjs('',{
                type: 'quotable',
                schema: '$quotabl'
            },{
                quotable
            })
        },
        `[ValidationError@vjs://validate:quotable]: Validation Failed <= [QuotableValidationError@vjs://validate:quotable]: Quotable Validation Failed <= [SchemaDefError@vjs://validate:quotable/schema/quotabl]: Invalid Quotable Schema Key - quotable schema key [quotabl] not found in refs`)
        // 校验失败
        assertError(()=>{
            return vjs('23',{
                type: 'quotable',
                schema: '$quotable'
            },{
                quotable
            })
        },
        `[ValidationError@vjs://validate:quotable]: Validation Failed <= [QuotableValidationError@vjs://validate:quotable]: Quotable Validation Failed <= [ValidationError@vjs://validate:quotable/validate:string]: Validation Failed <= [StringValidationError@vjs://validate:quotable/validate:string]: String Validation Failed <= [RestrictionError@vjs://validate:quotable/validate:string/minLength|maxLength]: Restriction Not Satisfied`)
    }
})

// 测试 multiple 类型
test('JSchema Multiple Schemas', () => {
    // 简单的匹配
    let res = vjs(true,{
        type: 'multiple',
        oneOf: [
            {
                type: 'string'
            },
            {
                type: 'boolean'
            }
        ]
    })
    assertEquals(res,true)
    // type 配置错误
    assertError(()=>{
        res = vjs(true,{
            type: 'string',
            oneOf: [
                {
                    type: 'string'
                },
                {
                    type: 'integer'
                }
            ]
        })
    },
    `[ValidationError@vjs://validate:string]: Validation Failed <= [StringValidationError@vjs://validate:string]: String Validation Failed <= [SchemaDefError@vjs://validate:string/scanInputKeys:oneOf]: Invalid Schema Key - [oneOf]`)
    // oneOf 配置错误
    assertError(()=>{
        res = vjs(true,{
            type: 'multiple',
            oneOf: {
                a: {
                    type: 'string'
                },
                b: {
                    type: 'integer'
                }
            }
        })
    },
    `[ValidationError@vjs://validate:multiple]: Validation Failed <= [MultipleValidationError@vjs://validate:multiple]: Multiple Validation Failed <= [SchemaDefError@vjs://validate:multiple]: Invalid Schema Key - [oneOf] must be an Array of JSchema <= [ValidationError@vjs://validate:multiple/oneOf/validate:array]: Validation Failed <= [ArrayValidationError@vjs://validate:multiple/oneOf/validate:array]: Array Validation Failed <= [TargetTypeError@vjs://validate:multiple/oneOf/validate:array]: Wrong Type`)
    // 一个都不匹配
    assertError(()=>{
        res = vjs(true,{
            type: 'multiple',
            oneOf: [
                {
                    type: 'string'
                },
                {
                    type: 'integer'
                }
            ]
        })
    },
    `[ValidationError@vjs://validate:multiple]: Validation Failed <= [MultipleValidationError@vjs://validate:multiple]: Multiple Validation Failed <= [RestrictionError@vjs://validate:multiple/oneOf]: No One Matches`)
    // 复杂类型匹配
    const oneOf = [
        {
            type: 'object',
            properties: {
                a: {
                    type: 'integer',
                },
                b: {
                    type: 'string',
                }
            }
        },
        {
            type: 'array',
            items: {
                type: 'integer',
            }
        }
    ]
    res = vjs({
        a: 1,
        b: '',
        c: true
    },{
        type: 'multiple',
        oneOf
    })
    assertEquals(res,true)
    res = vjs([1,2,3,4],{
        type: 'multiple',
        oneOf
    })
    assertEquals(res,true)
    // fields 字段定义的校验
    const testSchema = {
        type: SchemaTypes.MULTIPLE,
        oneOf: [
            // 纯字符串 - 1个星号
            {
                type: SchemaTypes.REGEXP,
                expression: /^\*{1}$/g
            },
            // 纯字符串 - 支持用','分割的多个字段（允许别名）
            {
                type: SchemaTypes.REGEXP,
                expression: /^[^\d\s\*\,=>]+[^\s\*\,=>]*([^\d\s\*\,=>]*(=>)?[^\d\s\*\,=>]+[^\s\*\,=>]*)?([\,]{1}[^\d\s\*\,=>]+[^\s\*\,=>]*([^\d\s\*\,=>]*(=>)?[^\d\s\*\,=>]+[^\s\*\,=>]*)?)*$/
            },
            // 数组(元素可以是字符串或者 command)
            {
                type: SchemaTypes.ARRAY,
                items: [
                    // 纯字符串 - 1个星号
                    {
                        type: SchemaTypes.REGEXP,
                        rule: /^\*{1}$/
                    },
                    // 纯字符串 - 单字段支持别名设置
                    {
                        type: SchemaTypes.REGEXP,
                        rule: /^[^\d\s\*\,=>]+[^\s\*\,=>]*([^\d\s\*\,=>]*(=>)?[^\d\s\*\,=>]+[^\s\*\,=>]*)?$/
                    },
                    // command 对象 - 级联查询
                    {
                        type: SchemaTypes.QUOTABLE,
                        schema: '$commandSchema'
                    }
                ],
                minItemsCount: 1
            },
        ]
    }
    res = vjs('*',testSchema)
    assertEquals(res,true)
    res = vjs('s1,s2',testSchema)
    assertEquals(res,true)
    res = vjs('s1=>a1',testSchema)
    assertEquals(res,true)
    // res = vjs('*',testSchema)
})
