import assert from 'assert';

export default types => ({
  name: 'CreateComment',
  inputFields: {
    text: types.String,
    inspiredByPostID: types.ID,
  },
  outputFields: {
    post: types.Post,
  },
  mutateAndGetPayload: async (input, context, info) => {
    const {text, inspiredByPostID} = input;
    const {db, session} = context;
    const {currentUserId} = session;

    assert(currentUserId, 'must be signed in to create comment');
    assert(text.length > 0, 'comment must have text');

    const post = await db.findBy('posts', {id: inspiredByPostID});

    const comment = await db.insert('comments', {
      createdAt: new Date(),
      authoredByUserId: currentUserId,
      inspiredByPostID: inspiredByPostID.split(':')[1],
      text
    });

    return {post};
  },
});