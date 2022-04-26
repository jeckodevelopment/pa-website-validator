'use strict';

import { LH } from "lighthouse"

// @ts-ignore
const Audit = require('lighthouse').Audit

// @ts-ignore
const fs = require('fs')

// @ts-ignore
const storageFolder = __dirname + '/../../../storage/school'

const geoip = require('geoip-lite')
const dns = require('dns')
const util = require('util')
const allowedCountriesFiles = 'allowedCountries.json'


// @ts-ignore
class LoadAudit extends Audit {
    static get meta() {
        return {
            id: 'school-security-ip-location',
            title: 'Localizzazione indirizzo IP',
            failureTitle: "L'indirizzo IP non rientra in uno stato membro dell'UE",
            scoreDisplayMode: Audit.SCORING_MODES.NUMERIC,
            description: "Test per verificare l'area geografica dell'IP della macchina su cui è hostato il sito web",
            requiredArtifacts: ['securityIpLocation']
        }
    }

    static async audit(artifacts: any) : Promise<{ score: number, details: LH.Audit.Details.Table }> {
        const hostname = artifacts.securityIpLocation
        const allowedCountriesItems = JSON.parse(fs.readFileSync(storageFolder + '/' + allowedCountriesFiles))
        const allowedCountries = allowedCountriesItems.allowedCountries

        let score = 0
        const headings = [
            { key: 'ip_city', itemType: 'text', text: "Città indirizzo IP" },
            { key: 'ip_country', itemType: 'text', text: "Paese indirizzo IP" }
        ]
        let items = [ { ip_city: '', ip_country: '' } ]

        if (Boolean(hostname)) {
            const lookup = util.promisify(dns.lookup)
            const ip = await lookup(hostname)

            if (Boolean(ip) && Boolean(ip.address)) {
                const ipInformation = await geoip.lookup(ip.address)

                if (Boolean(ipInformation) && Boolean(ipInformation.country)) {
                    if (allowedCountries.includes(ipInformation.country)) {
                        score = 1
                    }

                    items[0].ip_city = ipInformation.city ?? ''
                    items[0].ip_country = ipInformation.country ?? ''
                }
            }
        }

        return {
            score: score,
            details: Audit.makeTableDetails(headings, items)
        }
    }
}

module.exports = LoadAudit;