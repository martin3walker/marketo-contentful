const mockSdk: any = {
  app: {
    onConfigure: jest.fn(),
    getParameters: jest.fn().mockReturnValueOnce({}),
    setReady: jest.fn(),
    getCurrentState: jest.fn(),
    parameters: {
      installation: {
        clientSecret: 'testSecret',
        clientId: 'testId',
        munchkinId: 'testMunchkin'
      }
    }
  },
};

const marketoCall: any = jest.fn(() => {
  return {satus: 200, results:[
    {name: "Test form 1", id: "1fkdjf"},
    {name: "Test form 2", id: "1fdfae"},
    {name: "Test form 3", id: "8sdahf"}
  ]}
})

export { mockSdk, marketoCall };
