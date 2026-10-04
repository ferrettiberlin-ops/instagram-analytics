# HKUST SOSC 3000L — Algorithmic Audit Project Participant Information Sheet & Informed Consent Agreement

## Project Context

This student-led academic project explores how recommendation engines segment and distribute content streams across the diverse student ecosystem of The Hong Kong University of Science and Technology (HKUST). The study examines chronological Instagram Reel sequences viewed while a participant manually browses the Instagram Reels hub.

The study compares demographic independent variables, including **age bracket**, **HKUST school**, and simplified **cultural identity** categories, against automated chronological Reel stream sequences. Cultural identity options are **Local Hong Kong Resident (Chinese Heritage)**, **Local Hong Kong Resident (Generational Ethnic Minority)**, **Expatriate**, **Immigrant / First-Generation Resettlement**, and **Third Culture Kid (TCK)**.

## What the Extension Collects

While enabled on the Instagram `/reels/` hub, the extension records:

- The participant’s **HKUST SID**, which is a direct university identifier and is stored to link the record to the study profile.
- The selected age bracket, HKUST school, and cultural identity category.
- Clean, canonical Instagram Reel URLs discovered in chronological order as Instagram renders them.
- The time each Reel link is recorded, its sequence index, and whether the surrounding content appears to be sponsored.

The extension does not infer private traits, read account credentials, or access information that Instagram does not render in the page.

## Data Collection Limits (The Privacy Shield)

The extension does **not** collect:

- Names, ITSC email addresses, telephone numbers, passwords, or payment information.
- Direct messages, comments, follower networks, likes, account passwords, or personal profile content.
- Browsing activity on other websites or cross-site tracking. The content script is inactive outside `instagram.com` and only records Reel links on the Instagram `/reels/` hub.
- Network interception, page layout changes, injected page markers, or hidden browser activity.

Because the HKUST SID is collected, the dataset is **pseudonymized rather than anonymous at collection**. The research team will use the SID only for the approved study linkage and will not publish it in reports or presentations.

## Data Security and Lifecycle

Records will be stored in an encrypted relational database cluster managed for the study. Access is restricted to the authorized SOSC 3000L group project members and approved academic supervisors. The data will be used only for this academic project, will not be sold or used for advertising, and will not be shared with Instagram or other commercial parties.

The project team will permanently delete the collected records and the linkage profile upon conclusion of the Fall 2026 academic term, no later than **December 31, 2026**, subject to any retention requirement imposed by HKUST or the applicable ethics approval.

## Voluntary Participation and Withdrawal

Participation is **100% voluntary**. You may decline before activation or withdraw at any time without academic, financial, or other penalty. To stop future collection, open the Chrome extensions page, right-click the extension, and choose **Remove from Chrome**. You may also disable tracking in the extension dashboard.

Uninstalling stops future collection; it does not automatically erase records already submitted. For deletion, access, correction, or other Personal Data (Privacy) Ordinance (PDPO) requests concerning submitted records, contact the study team using the approved contact details supplied by the course or ethics approval. The project team will respond according to the approved HKUST research-ethics process.

## Institutional Review and Contact

This project is conducted for **HKUST SOSC 3000L** and must be operated consistently with the approved HKUST Human and Artefacts Research Ethics Committee (HAREC) protocol. The student team must insert the approved principal investigator, supervisor, HAREC reference, and contact details before participant distribution:

- Principal investigator / course supervisor: **[insert approved name and contact]**
- Student research team: **[insert approved contact]**
- HAREC reference or contact: **[insert approved reference/contact]**

## Informed Consent

By checking the box below, I confirm that:

- I am **18 years of age or older**.
- I have read and understood this information sheet.
- I understand that the study collects my HKUST SID as a direct identifier, together with the stated demographic categories and Reel-stream telemetry.
- I understand that the telemetry is pseudonymized for analysis but is not anonymous at the point of collection.
- I understand the tracking scope, data security, retention, and withdrawal terms above.
- I voluntarily agree to participate in the study and to enable the extension under these parameters.

**Required consent statement:** I confirm that I am 18 years or older, understand the pseudonymized nature of the telemetry and the collection of my HKUST SID, and agree to the tracking parameters described above.
