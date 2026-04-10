import React from "react";

function parseInline(text: string) {
  const nodes: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    const codeMatch = remaining.match(/^`([^`]+)`/);
    if (codeMatch) {
      nodes.push(
        <code
          key={`code-${key++}`}
          className="rounded-md border border-slate-200 bg-slate-100 px-1.5 py-0.5 font-mono text-[0.92em] text-slate-900"
        >
          {codeMatch[1]}
        </code>,
      );
      remaining = remaining.slice(codeMatch[0].length);
      continue;
    }

    const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch) {
      nodes.push(
        <a
          key={`link-${key++}`}
          href={linkMatch[2]}
          className="font-medium text-slate-950 underline decoration-slate-300 underline-offset-4 transition-colors hover:text-slate-700"
        >
          {linkMatch[1]}
        </a>,
      );
      remaining = remaining.slice(linkMatch[0].length);
      continue;
    }

    const boldMatch = remaining.match(/^\*\*([^*]+)\*\*/);
    if (boldMatch) {
      nodes.push(
        <strong key={`strong-${key++}`} className="font-semibold text-slate-950">
          {boldMatch[1]}
        </strong>,
      );
      remaining = remaining.slice(boldMatch[0].length);
      continue;
    }

    const italicMatch = remaining.match(/^\*([^*]+)\*/);
    if (italicMatch) {
      nodes.push(<em key={`em-${key++}`}>{italicMatch[1]}</em>);
      remaining = remaining.slice(italicMatch[0].length);
      continue;
    }

    const nextSpecial = remaining.search(/[`[*\[]/);
    if (nextSpecial === -1) {
      nodes.push(remaining);
      break;
    }

    if (nextSpecial > 0) {
      nodes.push(remaining.slice(0, nextSpecial));
      remaining = remaining.slice(nextSpecial);
    }
  }

  return nodes;
}

function isOrderedListItem(line: string) {
  return /^\d+\.\s+/.test(line);
}

export function Markdown({ content }: { content: string }) {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const blocks: React.ReactNode[] = [];
  let key = 0;
  let index = 0;

  while (index < lines.length) {
    const line = lines[index].trimEnd();

    if (!line.trim()) {
      index += 1;
      continue;
    }

    if (line.startsWith("```")) {
      const codeLines: string[] = [];
      index += 1;

      while (index < lines.length && !lines[index].startsWith("```")) {
        codeLines.push(lines[index]);
        index += 1;
      }

      if (index < lines.length) {
        index += 1;
      }

      blocks.push(
        <pre
          key={`pre-${key++}`}
          className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-950 px-5 py-4 text-sm leading-6 text-slate-100 shadow-sm"
        >
          <code>{codeLines.join("\n")}</code>
        </pre>,
      );
      continue;
    }

    if (line.startsWith("### ")) {
      blocks.push(
        <h3 key={`h3-${key++}`} className="mt-4 text-lg font-semibold text-slate-950">
          {parseInline(line.slice(4))}
        </h3>,
      );
      index += 1;
      continue;
    }

    if (line.startsWith("## ")) {
      blocks.push(
        <h2 key={`h2-${key++}`} className="mt-6 text-2xl font-semibold tracking-tight text-slate-950">
          {parseInline(line.slice(3))}
        </h2>,
      );
      index += 1;
      continue;
    }

    if (line.startsWith("# ")) {
      blocks.push(
        <h1 key={`h1-${key++}`} className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          {parseInline(line.slice(2))}
        </h1>,
      );
      index += 1;
      continue;
    }

    if (line.startsWith("- ") || isOrderedListItem(line)) {
      const items: string[] = [];
      const ordered = isOrderedListItem(line);

      while (
        index < lines.length &&
        (lines[index].trimStart().startsWith("- ") || isOrderedListItem(lines[index].trimStart()))
      ) {
        const currentLine = lines[index].trimStart();
        items.push(ordered ? currentLine.replace(/^\d+\.\s+/, "") : currentLine.slice(2));
        index += 1;
      }

      blocks.push(
        ordered ? (
          <ol key={`ol-${key++}`} className="space-y-2 pl-5 text-slate-700">
            {items.map((item, itemIndex) => (
              <li key={itemIndex} className="list-decimal leading-7">
                {parseInline(item)}
              </li>
            ))}
          </ol>
        ) : (
          <ul key={`ul-${key++}`} className="space-y-2 pl-5 text-slate-700">
            {items.map((item, itemIndex) => (
              <li key={itemIndex} className="list-disc leading-7">
                {parseInline(item)}
              </li>
            ))}
          </ul>
        ),
      );
      continue;
    }

    const paragraphLines = [line.trim()];
    index += 1;

    while (
      index < lines.length &&
      lines[index].trim() !== "" &&
      !lines[index].startsWith("# ") &&
      !lines[index].startsWith("## ") &&
      !lines[index].startsWith("### ") &&
      !lines[index].startsWith("- ") &&
      !isOrderedListItem(lines[index]) &&
      !lines[index].startsWith("```")
    ) {
      paragraphLines.push(lines[index].trim());
      index += 1;
    }

    blocks.push(
      <p key={`p-${key++}`} className="max-w-none leading-7 text-slate-700">
        {parseInline(paragraphLines.join(" "))}
      </p>,
    );
  }

  return <div className="space-y-4">{blocks}</div>;
}
