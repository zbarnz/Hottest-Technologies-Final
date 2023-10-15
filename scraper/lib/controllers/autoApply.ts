import { AutoApply } from "../../src/entity/AutoApply";
import { getConnection } from "../../src/data-source";

export async function save(autoApply: AutoApply) {
  const connection = await getConnection();
  return await connection.manager.save(autoApply);
}

export async function get(autoApplyId: AutoApply["id"]) {
  const connection = await getConnection();
  return await connection.manager.findOne(AutoApply, {
    where: { id: autoApplyId },
  });
}


