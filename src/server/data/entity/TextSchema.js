const EntitySchema = require("typeorm").EntitySchema;
const Text = require("../model/Models").Text;
module.exports = new EntitySchema({
    name: "Text",
    target: Text,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        content: {
            type: "varchar",
        },
        oldType: {
            type: "varchar",
        },
        newType: {
            type: "varchar",
        },
        dateTime: {
            type: "datetime",
        },
        textComment: {
            type: "varchar",
        },
    },
    relations: {
        account: {
            type: 'many-to-one',
            target: 'Account',
            joinColumn: true,
            nullable: false,
            inverseSide: 'texts',
        },
    }
});
