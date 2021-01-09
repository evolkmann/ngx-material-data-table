import { BaseTableConfig, BaseTableConfigShort, ConfigToShortNamesMapper, decodeConfig, encodeConfig } from './config';

interface TestConfig extends BaseTableConfig {
  name?: string;
}

interface TestConfigShort extends BaseTableConfigShort {
  n?: string;
}

const mapper: ConfigToShortNamesMapper<TestConfig, TestConfigShort> = {
  fromShort: c => ({
    name: c.n
  }),
  toShort: c => ({
    n: c.name
  })
}

describe('Config', () => {
  let conf: TestConfig;
  let shortConfig: TestConfigShort;
  let encodedWithMapper: string;
  let encodedWithoutMapper: string;

  beforeEach(() => {
    conf = {
      pageSize: 10,
      pageIndex: 1,
      name: 'test',
      orderBy: [
        'name'
      ]
    };
    shortConfig = {
      s: conf.pageSize,
      i: conf.pageIndex,
      n: conf.name,
      o: conf.orderBy
    };
    encodedWithoutMapper = `{\"i\":${conf.pageIndex},\"s\":${conf.pageSize},\"o\":[\"${conf.orderBy![0]}\"],\"name\":\"${conf.name}\"}`;
    encodedWithMapper = `{\"i\":${conf.pageIndex},\"s\":${conf.pageSize},\"o\":[\"${conf.orderBy![0]}\"],\"n\":\"${conf.name}\"}`;
  });

  describe('encodeConfig()', () => {
    it('should encode with mapper', () => {
      expect(encodeConfig<TestConfig, TestConfigShort>(conf, mapper)).toEqual(encodedWithMapper);
    });
    it('should encode without mapper', () => {
      expect(encodeConfig<TestConfig, TestConfigShort>(conf)).toEqual(encodedWithoutMapper);
    });
  });

  describe('decodeConfig()', () => {
    it('should decode with mapper', () => {
      expect(decodeConfig<TestConfig, TestConfigShort>(encodedWithMapper, mapper)).toEqual(conf);
    });
    it('should decode without mapper', () => {
      expect(decodeConfig<TestConfig, TestConfigShort>(encodedWithMapper)).toEqual({
        pageIndex: conf.pageIndex,
        pageSize: conf.pageSize,
        orderBy: conf.orderBy,
        n: conf.name
      } as any);
    });
  });
});
