const EntitySchema = require("typeorm").EntitySchema;
const Comment = require("../model/Models").Comment;
module.exports = new EntitySchema({
    name: "Comment",
    target: Comment,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        content: {
            type: "varchar",
        },
        dateTime: {
            type: "datetime",
        },
    },
    relations: {
        account: {
            type: 'many-to-one',
            target: 'Account',
            joinColumn: true,
            nullable: false,
            inverseSide: 'comments',
        },
    }
});
