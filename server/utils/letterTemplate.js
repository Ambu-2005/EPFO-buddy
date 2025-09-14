export function generateLetterTemplate(name, issue) {
  return `
To,
The Regional PF Commissioner,
Employees' Provident Fund Organisation

Subject: Request for Assistance Regarding ${issue}

Respected Sir/Madam,

I, ${name}, am writing to request your assistance regarding ${issue}.
Kindly look into this matter and provide guidance on the next steps.

Thank you.

Sincerely,
${name}
  `;
}
