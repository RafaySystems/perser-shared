// Copyright The Perses Authors
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@perses-dev/components';
import { ExternalLink as LaunchIcon } from 'lucide-react';
import { Link } from '@perses-dev/spec';
import { ReactElement } from 'react';
import { InfoTooltip } from '@perses-dev/components';
import { useReplaceVariablesInString } from '@perses-dev/plugin-system';

type LinksVariant = 'dashboard' | 'panel';

interface LinksProps {
  links: Link[];
  variant: LinksVariant;
}

export function LinksDisplay({ links, variant }: LinksProps): ReactElement | null {
  if (links.length === 0) {
    return null;
  }

  // Panel variant: single link shows as icon button
  if (variant === 'panel' && links.length === 1 && links[0]) {
    return <LinkButton link={links[0]} />;
  }

  // Dashboard variant: 1-3 links show as chips/badges
  if (variant === 'dashboard' && links.length <= 3) {
    const canRenderAsChips = links.every((link) => {
      if (link.name) {
        return link.name.length < 30;
      }
      if (link.url) {
        return link.url.length < 70;
      }
      return false;
    });

    if (canRenderAsChips) {
      return (
        <div className="flex flex-row gap-1">
          {links.map((link: Link) => (
            <LinkChip key={link.url} link={link} />
          ))}
        </div>
      );
    }
  }

  // Default: show dropdown menu for multiple links
  return (
    <InfoTooltip description={`${links.length} links`} enterDelay={100}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`${variant}-links`}
            id={`${variant}-links-button`}
            className="rounded p-1 h-auto w-auto"
          >
            <LaunchIcon
              aria-describedby="links-icon"
              fontSize="inherit"
              className="text-muted-foreground"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {links.map((link: Link) => (
            <LinkMenuItemInner key={link.url} link={link} />
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </InfoTooltip>
  );
}

function LinkChip({ link }: { link: Link }): ReactElement {
  const { url, name, tooltip, targetBlank } = useLink(link);

  return (
    <InfoTooltip description={tooltip ?? url} enterDelay={100}>
      <a href={url} target={targetBlank ? '_blank' : '_self'} rel="noopener noreferrer">
        <Badge variant="outline" className="h-6 cursor-pointer hover:bg-accent gap-1">
          <LaunchIcon fontSize="inherit" />
          {name ?? url}
        </Badge>
      </a>
    </InfoTooltip>
  );
}

function LinkButton({ link }: { link: Link }): ReactElement {
  const { url, name, tooltip, targetBlank } = useLink(link);

  return (
    <InfoTooltip description={tooltip ?? url} enterDelay={100}>
      <a
        aria-label={name ?? url}
        href={url}
        target={targetBlank ? '_blank' : '_self'}
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center rounded p-1 hover:bg-accent transition-colors"
      >
        <LaunchIcon fontSize="inherit" className="text-muted-foreground" />
      </a>
    </InfoTooltip>
  );
}

function LinkMenuItemInner({ link }: { link: Link }): ReactElement {
  const { url, name, tooltip, targetBlank } = useLink(link);

  return (
    <InfoTooltip description={tooltip ?? url} enterDelay={100}>
      <DropdownMenuItem asChild>
        <a href={url} target={targetBlank ? '_blank' : '_self'} rel="noopener noreferrer">
          {name ?? url}
        </a>
      </DropdownMenuItem>
    </InfoTooltip>
  );
}

function useLink(link: Link): Link {
  const url = useReplaceVariablesInString(link.url) ?? link.url;
  const name = useReplaceVariablesInString(link.name);
  const tooltip = useReplaceVariablesInString(link.tooltip);

  if (link.renderVariables === false) {
    return link;
  }

  return { ...link, url, name, tooltip };
}
