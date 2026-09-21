import { isAbsolute, relative, resolve, sep } from "node:path";

export function assertPrivateOutputRoot(repositoryRoot: string, configuredRoot: string): string {
  const resolvedRepositoryRoot = resolve(repositoryRoot);
  const resolvedOutputRoot = resolve(configuredRoot);
  const relativePath = relative(resolvedRepositoryRoot, resolvedOutputRoot);
  const isInsideRepository =
    relativePath === "" ||
    (!relativePath.startsWith(`..${sep}`) && relativePath !== ".." && !isAbsolute(relativePath));

  if (isInsideRepository) {
    throw new Error(
      "DAILY_RUN_OUTPUT_ROOT must be outside the public repository. Use a private runtime data directory.",
    );
  }

  return resolvedOutputRoot;
}
