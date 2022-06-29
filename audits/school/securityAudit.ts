"use strict";

import { run as securityAudit } from "../../utils/securityAuditLogic";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import lighthouse from "lighthouse";
const Audit = lighthouse.Audit;

class LoadAudit extends Audit {
  static get meta() {
    return {
      id: "school-security",
      title:
        "C.SC.3.1 - CERTIFICATO HTTPS - Il sito scuola deve avere un certificato https valido e attivo.",
      failureTitle:
        "C.SC.3.1 - CERTIFICATO HTTPS - Il sito scuola deve avere un certificato https valido e attivo.",
      scoreDisplayMode: Audit.SCORING_MODES.BINARY,
      description:
        "CONDIZIONI DI SUCCESSO: il sito utilizza un certificato https valido e non obsoleto secondo le raccomandazioni AgID; MODALITÀ DI VERIFICA: viene verificato che il certificato https del sito sia valido e attivo; RIFERIMENTI TECNICI E NORMATIVI: [Agid Raccomandazioni in merito allo standard Transport Layer Security (TLS)](https://cert-agid.gov.it/wp-content/uploads/2020/11/AgID-RACCSECTLS-01.pdf).",
      requiredArtifacts: ["origin"],
    };
  }

  static async audit(
    artifacts: LH.Artifacts & { origin: string }
  ): Promise<{ score: number; details: LH.Audit.Details.Table }> {
    const origin = artifacts.origin;

    return await securityAudit(origin);
  }
}

module.exports = LoadAudit;