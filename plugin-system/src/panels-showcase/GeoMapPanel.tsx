import { useEffect, useMemo, type ReactElement } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import type { PanelProps } from '../model';
import { DEFAULT_MOCK_GEO_SITES, type MockGeoSite } from './mockFixtures';

export type GeoMapPanelSpec = {
  sites?: MockGeoSite[];
  center?: [number, number];
  zoom?: number;
};

const STATUS_HEX: Record<MockGeoSite['status'], string> = {
  healthy: '#22c55e',
  degraded: '#eab308',
  down: '#ef4444',
};

function markerIcon(status: MockGeoSite['status']): L.DivIcon {
  return L.divIcon({
    className: '',
    html: `<div style="width:14px;height:14px;border-radius:999px;background:${STATUS_HEX[status]};border:2px solid #fff;box-shadow:0 0 0 1px rgba(0,0,0,.35)"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

export function GeoMapPanel({ spec, contentDimensions }: PanelProps<GeoMapPanelSpec>): ReactElement {
  const panelSpec = spec as GeoMapPanelSpec;
  const sites = panelSpec.sites?.length ? panelSpec.sites : DEFAULT_MOCK_GEO_SITES;
  const height = Math.max(contentDimensions?.height ?? 280, 180);
  const width = Math.max(contentDimensions?.width ?? 400, 200);
  const center = panelSpec.center ?? ([20, 10] as [number, number]);
  const zoom = panelSpec.zoom ?? 2;

  // Fix default marker paths when bundlers rewrite asset URLs (we use DivIcon anyway).
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (L.Icon.Default.prototype as any)._getIconUrl;
  }, []);

  const markers = useMemo(
    () =>
      sites.map((site) => (
        <Marker key={site.id} position={[site.lat, site.lng]} icon={markerIcon(site.status)}>
          <Popup>
            <strong>{site.name}</strong>
            <div>{site.region}</div>
            <div style={{ textTransform: 'capitalize' }}>{site.status}</div>
          </Popup>
        </Marker>
      )),
    [sites]
  );

  return (
    <div style={{ width, height }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ width: '100%', height: '100%', background: '#0b1220' }}
        scrollWheelZoom={false}
        attributionControl
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {markers}
      </MapContainer>
    </div>
  );
}
