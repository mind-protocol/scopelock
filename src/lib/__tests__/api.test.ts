/**
 * API Client Tests
 * Maps to: AC.md F1 (Authentication) and F2 (Missions)
 *
 * Tests the API client with real backend integration (USE_MOCK_DATA = false)
 */

import { describe, it, expect, beforeAll } from 'vitest'
import { api } from '../api'
import type { User, Mission } from '../../types'

describe('API Client - Integration Tests', () => {
  let authToken: string | null = null
  let testUser: User | null = null

  describe('F1 - Authentication (AC.md)', () => {
    it('should login with valid credentials and return JWT token', async () => {
      const result = await api.login('person1@scopelock.ai', 'testpass')

      expect(result.access_token).toBeTruthy()
      expect(typeof result.access_token).toBe('string')
      expect(result.user).toBeTruthy()
      expect(result.user.email).toBe('person1@scopelock.ai')
      expect(result.user.name).toBeTruthy()

      // Save for subsequent tests
      authToken = result.access_token
      testUser = result.user
    })

    it('should reject invalid credentials', async () => {
      await expect(
        api.login('invalid@example.com', 'wrongpassword')
      ).rejects.toThrow()
    })

    it('should reject empty credentials', async () => {
      await expect(
        api.login('', '')
      ).rejects.toThrow()
    })
  })

  describe('F2 - Missions (AC.md)', () => {
    it('should fetch missions with valid authentication', async () => {
      // Login to get token
      const loginResult = await api.login('person1@scopelock.ai', 'testpass')
      expect(loginResult.access_token).toBeTruthy()

      // Fetch missions
      const missions = await api.listMissions()

      expect(missions).toBeTruthy()
      expect(Array.isArray(missions)).toBe(true)
      expect(missions.length).toBeGreaterThanOrEqual(0)
    })

    it('should reject unauthenticated requests without token', async () => {
      // Clear localStorage to simulate unauthenticated request
      const savedToken = localStorage.getItem('access_token')
      localStorage.removeItem('access_token')

      try {
        await expect(
          api.listMissions()
        ).rejects.toThrow()
      } finally {
        // Restore token
        if (savedToken) localStorage.setItem('access_token', savedToken)
      }
    })
  })

  describe('Data Structure Validation', () => {
    it('should return properly structured Mission objects', async () => {
      // Login to get token
      await api.login('person1@scopelock.ai', 'testpass')

      const missions = await api.listMissions()

      // If missions exist, validate structure
      if (missions.length > 0) {
        const mission = missions[0]

        expect(mission).toHaveProperty('id')
        expect(mission).toHaveProperty('title')
        expect(mission).toHaveProperty('status')
        expect(mission).toHaveProperty('stack')
        expect(mission).toHaveProperty('created_at')
        expect(mission).toHaveProperty('updated_at')

        // Validate stack structure
        expect(mission.stack).toHaveProperty('backend')
        expect(mission.stack).toHaveProperty('frontend')
        expect(mission.stack).toHaveProperty('database')
        expect(mission.stack).toHaveProperty('deploy_backend')
        expect(mission.stack).toHaveProperty('deploy_frontend')
      }
    })
  })
})
