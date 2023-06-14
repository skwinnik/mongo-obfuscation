import { resumeTokensCollection } from "../../collections";

export async function saveResumeToken(
  collectionName: string,
  resumeToken: unknown
) {
  await resumeTokensCollection.replaceOne(
    { collection: collectionName },
    {
      collection: collectionName,
      resumeToken,
      date: new Date(),
    },
    {
      upsert: true,
    }
  );
}

export async function loadResumeToken(
  collectionName: string
): Promise<unknown | undefined> {
  const resumeToken = await resumeTokensCollection.findOne({
    collection: collectionName,
  });
  return resumeToken?.resumeToken;
}
