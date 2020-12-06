const { ApolloError } = require('apollo-server-express');
module.exports = {
    Query: {
        async sentences(parent, args, {models}, info){
           const sentences = await models.Sentences.findAll();
           return sentences;
        },
        async sentencesByUsername(parent, { username }, {models}, info){
           const sentences = await models.Sentences.findAll({ where: {username} });
           return sentences;
        },

    },
    Mutation: {
        async createSentence(parent, { username, sentence }, {models}, info){
            const sentenceUsernameExist = await models.Sentences.findOne({ where: { username, sentence }});
            console.log('sentenceUsernameExist', sentenceUsernameExist);
            if(sentenceUsernameExist){
                throw new ApolloError('sentenceUsernameExist')
            }
            const sentenceRes = await models.Sentences.create({ username, sentence, createdAt: Date.now(), updateAt: Date.now() });
            console.log('sentence', sentenceRes);
            return sentenceRes;
        },
        async removeSentence(parent, { id }, {models}, info){
            const sentenceUsernameExist = await models.Sentences.findByPk(id);
            if(!sentenceUsernameExist){
                throw new ApolloError('does not exist')
            }
            await sentenceUsernameExist.destroy();
            return true;
        }
    }
}
