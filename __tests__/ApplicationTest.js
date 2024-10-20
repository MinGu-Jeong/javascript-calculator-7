import App from '../src/App.js';
import { MissionUtils } from '@woowacourse/mission-utils';

const mockQuestions = (inputs) => {
  MissionUtils.Console.readLineAsync = jest.fn();

  MissionUtils.Console.readLineAsync.mockImplementation(() => {
    const input = inputs.shift();
    return Promise.resolve(input);
  });
};

const getLogSpy = () => {
  const logSpy = jest.spyOn(MissionUtils.Console, 'print');
  logSpy.mockClear();
  return logSpy;
};

describe('문자열 계산기', () => {
  test('커스텀 구분자 사용', async () => {
    const inputs = ['//;\\n1'];
    mockQuestions(inputs);

    const logSpy = getLogSpy();
    const outputs = ['결과 : 1'];

    const app = new App();
    await app.run();

    outputs.forEach((output) => {
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining(output));
    });
  });

  test('예외 테스트', async () => {
    const inputs = ['-1,2,3'];
    mockQuestions(inputs);

    const app = new App();

    await expect(app.run()).rejects.toThrow('[ERROR]');
  });

  test('빈 문자열 입력', async () => {
    const inputs = [''];
    mockQuestions(inputs);

    const logSpy = getLogSpy();
    const outputs = ['결과 : 0'];

    const app = new App();
    await app.run();

    outputs.forEach((output) => {
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining(output));
    });
  });

  test('기본 구분자 사용', async () => {
    const inputs = ['1,2,3'];
    mockQuestions(inputs);

    const logSpy = getLogSpy();
    const outputs = ['결과 : 6'];

    const app = new App();
    await app.run();

    outputs.forEach((output) => {
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining(output));
    });
  });

  test('문자 입력', async () => {
    const inputs = ['1,2,a'];
    mockQuestions(inputs);

    const app = new App();
    await expect(app.run()).rejects.toThrow('[ERROR]');
  });

  test('예외 테스트', async () => {
    const inputs = ['1,2,,'];
    mockQuestions(inputs);

    const app = new App();
    await expect(app.run()).rejects.toThrow('[ERROR]');
  });

  test('예외 테스트', async () => {
    const inputs = ['1,2,\n'];
    mockQuestions(inputs);

    const app = new App();
    await expect(app.run()).rejects.toThrow('[ERROR]');
  });

  test('커스텀 문자가 정규식 특수문자인 경우', async () => {
    const inputs = ['//[\n1[2'];
    mockQuestions(inputs);

    const logSpy = getLogSpy();
    const outputs = ['결과 : 3'];

    const app = new App();
    await app.run();

    outputs.forEach((output) => {
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining(output));
    });
  });

  test('커스텀 구분자가 뒤에 나오는 경우', async () => {
    const inputs = ['1[2//[\n'];
    mockQuestions(inputs);

    const app = new App();
    await expect(app.run()).rejects.toThrow('[ERROR]');
  });

  test('커스텀 구분자가 두자리인 경우', async () => {
    const inputs = ['//[!\n1[!2'];
    mockQuestions(inputs);

    const logSpy = getLogSpy();
    const outputs = ['결과 : 3'];

    const app = new App();
    await app.run();

    outputs.forEach((output) => {
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining(output));
    });
  });

  test('커스텀 구분자가 두자리인 예외 경우', async () => {
    const inputs = ['//[!\n1![2'];
    mockQuestions(inputs);

    const app = new App();
    await expect(app.run()).rejects.toThrow('[ERROR]');
  });
});
