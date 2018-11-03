import { DI } from 'core';

const Message = (text) => {
  DI.get('vue').$toast(text);
};

export default Message;
