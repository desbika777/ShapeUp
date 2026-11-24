type CamposLog = Record<string, unknown>;

function escreverLog(level: 'info' | 'warn' | 'error', event: string, fields: CamposLog = {}) {
  const payload = {
    level,
    event,
    timestamp: new Date().toISOString(),
    ...fields,
  };

  const line = JSON.stringify(payload);

  if (level === 'error') {
    console.error(line);
    return;
  }

  if (level === 'warn') {
    console.warn(line);
    return;
  }

  console.log(line);
}

export function logInfo(event: string, fields?: CamposLog) {
  escreverLog('info', event, fields);
}

export function logWarn(event: string, fields?: CamposLog) {
  escreverLog('warn', event, fields);
}

export function logError(event: string, fields?: CamposLog) {
  escreverLog('error', event, fields);
}
