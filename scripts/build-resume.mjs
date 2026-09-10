import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const yamlPath = path.join(rootDir, 'resume', 'resume.yaml');
const outTexPath = path.join(rootDir, 'temp', 'resume.tex');

function parseYaml(str) {
  const lines = str.split('\n');
  let idx = 0;

  function parseBlock(currentIndent) {
    let result = null;

    while (idx < lines.length) {
      const line = lines[idx];
      const trimmed = line.trim();

      if (!trimmed || trimmed.startsWith('#')) {
        idx++;
        continue;
      }

      const indent = line.search(/\S/);
      if (indent < currentIndent) {
        return result;
      }

      if (trimmed.startsWith('- ')) {
        if (!result) result = [];
        const content = trimmed.slice(2).trim();

        if (content.endsWith(': >') || content.endsWith(': |')) {
          const key = content.slice(0, -3).trim();
          idx++;
          const folded = [];
          while (idx < lines.length) {
            const nextL = lines[idx];
            const nextT = nextL.trim();
            if (!nextT) { idx++; continue; }
            const nextI = nextL.search(/\S/);
            if (nextI <= indent + 2) break;
            folded.push(nextT);
            idx++;
          }
          result.push({ [key]: folded.join(' ') });
        } else if (content.includes(':')) {
          const colonIdx = content.indexOf(':');
          const k = content.slice(0, colonIdx).trim();
          let v = content.slice(colonIdx + 1).trim();
          if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
          if (v.startsWith("'") && v.endsWith("'")) v = v.slice(1, -1);

          idx++;
          const obj = { [k]: v };
          while (idx < lines.length) {
            const nextL = lines[idx];
            const nextT = nextL.trim();
            if (!nextT || nextT.startsWith('#')) { idx++; continue; }
            const nextI = nextL.search(/\S/);
            if (nextI <= indent || nextT.startsWith('- ')) break;

            if (nextT.endsWith(': >') || nextT.endsWith(': |')) {
              const subK = nextT.slice(0, -3).trim();
              idx++;
              const subFolded = [];
              while (idx < lines.length) {
                const fL = lines[idx];
                const fT = fL.trim();
                if (!fT) { idx++; continue; }
                const fI = fL.search(/\S/);
                if (fI <= nextI) break;
                subFolded.push(fT);
                idx++;
              }
              obj[subK] = subFolded.join(' ');
            } else if (nextT.endsWith(':')) {
              const subK = nextT.slice(0, -1).trim();
              idx++;
              obj[subK] = parseBlock(nextI + 2);
            } else if (nextT.includes(':')) {
              const cI = nextT.indexOf(':');
              const subK = nextT.slice(0, cI).trim();
              let subV = nextT.slice(cI + 1).trim();
              if (subV.startsWith('"') && subV.endsWith('"')) subV = subV.slice(1, -1);
              if (subV.startsWith("'") && subV.endsWith("'")) subV = subV.slice(1, -1);
              obj[subK] = subV;
              idx++;
            } else {
              break;
            }
          }
          result.push(obj);
        } else {
          let val = content;
          if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
          if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
          result.push(val);
          idx++;
        }
      } else if (trimmed.includes(':')) {
        if (!result) result = {};
        const colonIdx = trimmed.indexOf(':');
        const key = trimmed.slice(0, colonIdx).trim();
        let val = trimmed.slice(colonIdx + 1).trim();

        if (val === '>' || val === '|') {
          idx++;
          const folded = [];
          while (idx < lines.length) {
            const nextL = lines[idx];
            const nextT = nextL.trim();
            if (!nextT) { idx++; continue; }
            const nextI = nextL.search(/\S/);
            if (nextI <= indent) break;
            folded.push(nextT);
            idx++;
          }
          result[key] = folded.join(' ');
        } else if (val === '') {
          idx++;
          result[key] = parseBlock(indent + 2);
        } else {
          if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
          if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
          result[key] = val;
          idx++;
        }
      } else {
        idx++;
      }
    }
    return result;
  }

  return parseBlock(0);
}

function escapeLatex(text) {
  if (!text) return '';
  return String(text)
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/&/g, '\\&')
    .replace(/%/g, '\\%')
    .replace(/\$/g, '\\$')
    .replace(/#/g, '\\#')
    .replace(/_/g, '\\_')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}')
    .replace(/---/g, '---')
    .replace(/--/g, '--');
}

function getPreamble() {
  return `\\documentclass[a4paper,11pt]{article}
\\usepackage[margin=0.75in]{geometry}
\\usepackage{titlesec}
\\usepackage{enumitem}
\\usepackage{hyperref}
\\usepackage{xcolor}
\\usepackage{ragged2e}

\\definecolor{accent}{RGB}{22,78,148}

\\hypersetup{
  colorlinks=true,
  urlcolor=accent,
  linkcolor=accent
}

\\titleformat{\\section}{\\large\\bfseries\\color{accent}}{}{0em}{}[\\color{accent}\\titlerule]
\\titlespacing{\\section}{0pt}{10pt}{6pt}

\\setlength{\\parindent}{0pt}
\\pagestyle{empty}

\\newcommand{\\entryhead}[2]{\\textbf{#1} \\hfill #2\\\\}
\\newcommand{\\entrysub}[2]{\\textit{#1} \\hfill \\textit{#2}\\\\[3pt]}

\\setlist[itemize]{leftmargin=1.15em, itemsep=2pt, topsep=1pt}

\\RaggedRight
`;
}

function renderEducation(data) {
  if (!data.education?.length) return [];
  const lines = [
    '% ==================== EDUCATION ====================',
    '\\section{Education}\n',
  ];
  for (const edu of data.education) {
    lines.push(`\\entryhead{${escapeLatex(edu.school)}}{${edu.years || ''}}`);
    lines.push(`\\entrysub{${escapeLatex(edu.degree)}}{${escapeLatex(edu.score || '')}}\n`);
  }
  return lines;
}

function renderExperience(data) {
  if (!data.experience?.length) return [];
  const lines = [
    '% ==================== EXPERIENCE ====================',
    '\\section{Experience}\n',
  ];
  for (const exp of data.experience) {
    lines.push(`\\entryhead{${escapeLatex(exp.role)}}{${escapeLatex(exp.period)}}`);
    lines.push(`\\entrysub{${escapeLatex(exp.company)}}{}`);
    if (exp.highlights?.length) {
      lines.push('\\begin{itemize}');
      for (const item of exp.highlights) {
        const cleanItem = escapeLatex(item).replace(/\\textbackslash\{\}textbar\\textbackslash\{\}/g, '|');
        lines.push(`  \\item ${cleanItem}`);
      }
      lines.push('\\end{itemize}\n');
    }
  }
  return lines;
}

function renderProjects(data) {
  if (!data.projects?.length) return [];
  const lines = [
    '% ==================== PROJECTS ====================',
    '\\section{Projects}\n',
  ];
  for (let i = 0; i < data.projects.length; i++) {
    const proj = data.projects[i];
    if (i > 0) lines.push('\\vspace{2pt}');
    const linkLatex = proj.link?.url
      ? `\\href{${proj.link.url}}{${escapeLatex(proj.link.label || 'Link')}}`
      : '';
    lines.push(`\\entryhead{${escapeLatex(proj.title)}}{${linkLatex}}`);
    if (proj.highlights?.length) {
      lines.push('\\begin{itemize}');
      for (const item of proj.highlights) {
        lines.push(`  \\item ${escapeLatex(item)}`);
      }
      lines.push('\\end{itemize}\n');
    }
  }
  return lines;
}

function renderSkills(data) {
  if (!data.skills?.length) return [];
  const lines = [
    '% ==================== SKILLS ====================',
    '\\section{Skills}',
  ];
  for (let i = 0; i < data.skills.length; i++) {
    const sk = data.skills[i];
    const isLast = i === data.skills.length - 1;
    lines.push(`\\textbf{${escapeLatex(sk.category)}:} ${escapeLatex(sk.items)}${isLast ? '' : '\\\\'}`);
  }
  lines.push('');
  return lines;
}

const sectionRenderers = {
  education: renderEducation,
  experience: renderExperience,
  projects: renderProjects,
  skills: renderSkills,
};

function buildTexFromYaml(data) {
  const lines = [];

  lines.push(getPreamble());
  lines.push('\\begin{document}\n');

  // Header
  lines.push('% ==================== HEADER ====================');
  lines.push('\\begin{center}');
  lines.push(`  {\\LARGE \\bfseries ${escapeLatex(data.name)}}\\\\[4pt]`);
  const locParts = [];
  if (data.location) locParts.push(escapeLatex(data.location));
  if (data.relocation) locParts.push(escapeLatex(data.relocation));
  lines.push(`  ${locParts.join(' \\textbar\\ ')} \\\\[2pt]`);

  const contactParts = [];
  if (data.email) contactParts.push(`\\href{mailto:${data.email}}{${escapeLatex(data.email)}}`);
  if (data.phone) contactParts.push(escapeLatex(data.phone));
  lines.push(`  ${contactParts.join(' \\textbar\\ ')}\\\\[2pt]`);

  const linkParts = [];
  if (data.linkedin?.url) linkParts.push(`\\href{${data.linkedin.url}}{${escapeLatex(data.linkedin.label || 'LinkedIn')}}`);
  if (data.github?.url) linkParts.push(`\\href{${data.github.url}}{${escapeLatex(data.github.label || 'GitHub')}}`);
  lines.push(`  ${linkParts.join(' \\textbar\\ ')}`);
  lines.push('\\end{center}\n');

  // Summary
  if (data.summary) {
    lines.push('\\vspace{4pt}');
    lines.push(escapeLatex(data.summary.trim()) + '\n');
  }

  // Dynamic Section Ordering
  const order = Array.isArray(data.section_order) && data.section_order.length > 0
    ? data.section_order
    : ['education', 'experience', 'projects', 'skills'];

  for (const sec of order) {
    const key = String(sec).toLowerCase().trim();
    const renderer = sectionRenderers[key];
    if (renderer) {
      const sectionLines = renderer(data);
      if (sectionLines && sectionLines.length) {
        lines.push(...sectionLines);
      }
    }
  }

  lines.push('\\end{document}\n');
  return lines.join('\n');
}

export function compileResume() {
  if (!fs.existsSync(yamlPath)) {
    console.error(`YAML file not found: ${yamlPath}`);
    process.exit(1);
  }

  const rawYaml = fs.readFileSync(yamlPath, 'utf8');
  const data = parseYaml(rawYaml);
  const texContent = buildTexFromYaml(data);

  fs.writeFileSync(outTexPath, texContent, 'utf8');
  console.log('✓ Generated temp/resume.tex from resume/resume.yaml (zero-dependency)');

  try {
    execSync('tectonic -X compile temp/resume.tex --outdir public/', {
      cwd: rootDir,
      stdio: 'inherit',
    });
    const publicSynctex = path.join(rootDir, 'public', 'resume.synctex.gz');
    if (fs.existsSync(publicSynctex)) fs.unlinkSync(publicSynctex);

    console.log('✓ Compiled and updated public/resume.pdf');
  } catch (err) {
    console.error('Error compiling LaTeX with tectonic:', err.message);
  }
}

const isWatch = process.argv.includes('--watch');

compileResume();

if (isWatch) {
  console.log('\nWatching resume/resume.yaml for changes (Press Ctrl+C to stop)...');
  let timeout = null;
  fs.watch(yamlPath, (eventType) => {
    if (eventType === 'change') {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        console.log('\nresume/resume.yaml changed, recompiling...');
        compileResume();
      }, 300);
    }
  });
}
