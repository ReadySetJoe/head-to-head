export const helloWorldQuery = () => 'Hello world!';
export const helloWorldMutation = () => 'Hello world!';
export const printMessage = (_parent, { message }) => {
  console.log('message:', message);
  return message;
};
