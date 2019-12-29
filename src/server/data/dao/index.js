const createConnection = require("typeorm").createConnection;
const getRepository = require("typeorm").getRepository;
const Account = require("../model/Models").Account;
const Text = require("../model/Models").Text;
const Comment = require("../model/Models").Comment;
const sha256 = require('crypto-js/sha256');
const sqlOptions=require('../sqlOptions');
let Repositories = {
    accountRepository: null,
    textRepository: null,
    commentRepository: null,

};
createConnection(sqlOptions)
    .then(async (connection) => {
        Repositories.accountRepository = getRepository(Account);
        Repositories.textRepository = getRepository(Text);
        Repositories.commentRepository = getRepository(Comment);
        // let accounts = await Repositories.accountRepository.find({
        //     relations: ['members']
        // });
        // console.log('accounts.length: ' + accounts.length);
        // console.log('accounts: ' + JSON.stringify(accounts, null, 2));
        let Ids=[2,3,4,4534];

        // let members = await Repositories.memberRepository.findByIds(Ids,{relations: ['account']});
        // let members = await Repositories.memberRepository.find({
        //     account: {id: 2},
        //     // relations: ['account']
        // });
        // console.log('members.length: ' + members.length);
        // console.log('members: ' + JSON.stringify(members, null, 2));

        // let dataList = await Repositories.savingRepository.find({
        //     member: {id: 7},
        //     relations: ['member']
        // });
        // console.log('dataList.length: ' + dataList.length);
        // console.log('dataList: ' + JSON.stringify(dataList, null, 2));
        return true
    })
    .catch((error) => {
        console.log('应用启动失败');
        console.log(error);
        return false
    });
//
// var string ='123';
// console.log(sha256(sha256(string+'@Hi1Vssic7&kEIWb').toString()+'c@QSK2*fpav939#F').toString());
