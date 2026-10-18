export interface ReleaseInfo {
  version: string
  name: string
  body: string
  publishedAt: string
  downloadUrl?: string
  htmlUrl: string
}

export type UpdateStatus = 'idle' | 'checking' | 'available' | 'up-to-date' | 'error'

export const CURRENT_VERSION = '1.0.3'
export const GITHUB_REPO = 'zcharka/ArcWord'
export const GITHUB_REPO_URL = `https://github.com/${GITHUB_REPO}`
export const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`

// Helper to compare semver versions: e.g. "v1.0.1" vs "1.0.0"
export function isNewerVersion(latestTag: string, current: string): boolean {
  const cleanLatest = latestTag.replace(/^v/, '').trim()
  const cleanCurrent = current.replace(/^v/, '').trim()

  const latestParts = cleanLatest.split('.').map(p => parseInt(p, 10) || 0)
  const currentParts = cleanCurrent.split('.').map(p => parseInt(p, 10) || 0)

  const len = Math.max(latestParts.length, currentParts.length)
  for (let i = 0; i < len; i++) {
    const l = latestParts[i] ?? 0
    const c = currentParts[i] ?? 0
    if (l > c) return true
    if (l < c) return false
  }
  return false
}

export async function checkGitHubRelease(): Promise<{
  isUpdateAvailable: boolean
  release: ReleaseInfo | null
  error?: string
}> {
  try {
    const response = await fetch(GITHUB_API_URL, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        return {
          isUpdateAvailable: false,
          release: null,
          error: 'Brak opublikowanych wydań (Releases) w repozytorium GitHub.',
        }
      }
      throw new Error(`Błąd GitHub API: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    const tagName = data.tag_name || ''
    const isNewer = isNewerVersion(tagName, CURRENT_VERSION)

    // Find Windows installer asset (.exe)
    let downloadUrl = data.html_url
    if (Array.isArray(data.assets)) {
      const exeAsset = data.assets.find(
        (a: any) =>
          typeof a.name === 'string' &&
          (a.name.endsWith('.exe') || a.name.includes('Setup') || a.name.includes('installer'))
      )
      if (exeAsset && exeAsset.browser_download_url) {
        downloadUrl = exeAsset.browser_download_url
      }
    }

    const release: ReleaseInfo = {
      version: tagName,
      name: data.name || tagName,
      body: data.body || 'Brak opisu zmian.',
      publishedAt: data.published_at || '',
      downloadUrl,
      htmlUrl: data.html_url || GITHUB_REPO_URL,
    }

    return {
      isUpdateAvailable: isNewer,
      release,
    }
  } catch (err: any) {
    return {
      isUpdateAvailable: false,
      release: null,
      error: err?.message || 'Nie udało się połączyć z serwerami GitHub.',
    }
  }
}
