// Assume that GPTLog is in the same directory level as AutoApply
import { GPTLog } from "../../src/entity/GPTLog";
import { getConnection } from "../../src/data-source";

export async function createGPTLog(gptLog: GPTLog) {
  const connection = await getConnection();
  return await connection.manager.save(gptLog);
}

export async function getGPTLog(gptLogId: GPTLog["id"]) {
  const connection = await getConnection();
  return await connection.manager.findOne(GPTLog, {
    where: { id: gptLogId },
  });
}

export async function markGPTLogAsFailed(gptLogId: number): Promise<GPTLog> {
  const connection = await getConnection();

  const gptLog = await connection.manager.findOne(GPTLog, { where: { id: gptLogId } });

  if (!gptLog) {
    throw new Error(`GPTLog with ID ${gptLogId} not found.`);
  }

  // Mark the GPTLog as failed
  gptLog.failedFlag = true;

  // Save the updated GPTLog back to the database
  await connection.manager.save(gptLog);

  return gptLog; // This will return the updated GPTLog entity
}