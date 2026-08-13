<template>
  <div class="auth-page">
    <div class="auth-card">

      <!-- ── Left: Form Panel ── -->
      <section class="auth-form-panel">

        <div class="auth-logo">BudgetFlow</div>
        <p class="auth-welcome">Create your account</p>
        <h1 class="auth-title">Sign Up</h1>

        <!-- Alert -->
        <div
          v-if="alert.message"
          :class="['auth-alert', `auth-alert--${alert.type}`]"
          role="alert"
          style="margin-bottom: 0.75rem;"
        >
          {{ alert.message }}
        </div>

        <form class="auth-form" id="register-form" novalidate @submit.prevent="handleSubmit">

          <!-- First / Last name -->
          <div class="form-row-2">
            <div class="form-field">
              <label class="field-label" for="reg-first">First name</label>
              <div class="field-input-wrap">
                <input
                  id="reg-first"
                  v-model="form.firstName"
                  type="text"
                  class="field-input"
                  :class="{ 'is-error': errors.firstName }"
                  placeholder="Juan"
                  autocomplete="given-name"
                  @blur="() => (errors.firstName = form.firstName.trim() ? '' : 'Required.')"
                />
              </div>
              <span v-if="errors.firstName" class="field-error">{{ errors.firstName }}</span>
            </div>
            <div class="form-field">
              <label class="field-label" for="reg-last">Last name</label>
              <div class="field-input-wrap">
                <input
                  id="reg-last"
                  v-model="form.lastName"
                  type="text"
                  class="field-input"
                  :class="{ 'is-error': errors.lastName }"
                  placeholder="Dela Cruz"
                  autocomplete="family-name"
                  @blur="() => (errors.lastName = form.lastName.trim() ? '' : 'Required.')"
                />
              </div>
              <span v-if="errors.lastName" class="field-error">{{ errors.lastName }}</span>
            </div>
          </div>

          <!-- Email -->
          <div class="form-field">
            <label class="field-label" for="reg-email">Email</label>
            <div class="field-input-wrap">
              <input
                id="reg-email"
                v-model="form.email"
                type="email"
                class="field-input"
                :class="{ 'is-error': errors.email }"
                placeholder="you@example.com"
                autocomplete="email"
                @blur="validateEmail"
              />
            </div>
            <span v-if="errors.email" class="field-error">{{ errors.email }}</span>
          </div>

          <!-- Password -->
          <div class="form-field">
            <label class="field-label" for="reg-password">Password</label>
            <div class="field-input-wrap">
              <input
                id="reg-password"
                v-model="form.password"
                :type="showPwd ? 'text' : 'password'"
                class="field-input"
                :class="{ 'is-error': errors.password }"
                placeholder="Create a strong password"
                autocomplete="new-password"
                @input="updateStrength"
                @blur="validatePassword"
              />
              <button type="button" class="eye-toggle" @click="showPwd = !showPwd" :aria-label="showPwd ? 'Hide' : 'Show'">
                <svg v-if="!showPwd" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>
                </svg>
                <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              </button>
            </div>
            <!-- Strength -->
            <div v-if="form.password" class="pwd-strength">
              <div class="pwd-strength__bars">
                <div v-for="n in 4" :key="n" class="s-bar" :class="{ [`lvl-${strength}`]: n <= strength }"></div>
              </div>
              <span class="pwd-strength__text">{{ ['', 'Weak', 'Fair', 'Good', 'Strong'][strength] }}</span>
            </div>
            <span v-if="errors.password" class="field-error">{{ errors.password }}</span>
          </div>

          <!-- Confirm Password -->
          <div class="form-field">
            <label class="field-label" for="reg-confirm">Confirm password</label>
            <div class="field-input-wrap">
              <input
                id="reg-confirm"
                v-model="form.confirm"
                :type="showConfirm ? 'text' : 'password'"
                class="field-input"
                :class="{ 'is-error': errors.confirm }"
                placeholder="Repeat your password"
                autocomplete="new-password"
                @blur="validateConfirm"
              />
              <button type="button" class="eye-toggle" @click="showConfirm = !showConfirm" :aria-label="showConfirm ? 'Hide' : 'Show'">
                <svg v-if="!showConfirm" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>
                </svg>
                <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              </button>
            </div>
            <span v-if="errors.confirm" class="field-error">{{ errors.confirm }}</span>
          </div>

          <!-- Submit -->
          <button type="submit" id="register-submit" class="btn-login" :disabled="isLoading">
            <span v-if="isLoading" class="btn-spinner"></span>
            <span>{{ isLoading ? 'Creating account…' : 'SIGN UP' }}</span>
            <svg v-if="!isLoading" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>

          <!-- Terms -->
          <p class="auth-terms">
            By signing up, you agree to our
            <a href="#" id="terms-link">Terms</a> &amp;
            <a href="#" id="privacy-link">Privacy Policy</a>.
          </p>

          <!-- Divider -->
          <div class="auth-divider">or continue with</div>

          <!-- OAuth -->
          <div class="oauth-row">
            <button type="button" id="oauth-google-reg" class="btn-oauth" aria-label="Sign up with Google">
              <svg viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            </button>
            <button type="button" id="oauth-github-reg" class="btn-oauth" aria-label="Sign up with GitHub">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg>
            </button>
            <button type="button" id="oauth-facebook-reg" class="btn-oauth" aria-label="Sign up with Facebook">
              <svg viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </button>
          </div>
        </form>

        <p class="auth-switch">
          Already have an account?
          <router-link to="/login" id="go-to-login">Log in</router-link>
        </p>
      </section>

      <!-- ── Right: Illustration Panel ── -->
      <aside class="auth-illus-panel" aria-hidden="true">
        <img
          src="/login-illustration.jpg"
          alt="Person sitting on chair using laptop"
          draggable="false"
        />
      </aside>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import '../assets/auth.css'

const router      = useRouter()
const showPwd     = ref(false)
const showConfirm = ref(false)
const isLoading   = ref(false)
const strength    = ref(0)
const alert       = reactive({ message: '', type: 'error' })

const form = reactive({ firstName: '', lastName: '', email: '', password: '', confirm: '' })
const errors = reactive({ firstName: '', lastName: '', email: '', password: '', confirm: '' })

function updateStrength() {
  const p = form.password
  let s = 0
  if (p.length >= 8)           s++
  if (/[A-Z]/.test(p))        s++
  if (/[0-9]/.test(p))        s++
  if (/[^A-Za-z0-9]/.test(p)) s++
  strength.value = s
}

function validateEmail() {
  if (!form.email) errors.email = 'Email is required.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email.'
  else errors.email = ''
}

function validatePassword() {
  errors.password = form.password.length < 8 ? 'At least 8 characters required.' : ''
}

function validateConfirm() {
  errors.confirm = form.confirm !== form.password ? 'Passwords do not match.' : ''
}

function isValid() {
  errors.firstName = form.firstName.trim() ? '' : 'Required.'
  errors.lastName  = form.lastName.trim()  ? '' : 'Required.'
  validateEmail(); validatePassword(); validateConfirm()
  return Object.values(errors).every(e => !e)
}

async function handleSubmit() {
  alert.message = ''
  if (!isValid()) return
  isLoading.value = true
  try {
    // TODO: await api.post('/register', form)
    await new Promise(r => setTimeout(r, 1500))
    alert.type = 'success'
    alert.message = '✅ Account created! Redirecting to login…'
    setTimeout(() => router.push('/login'), 1500)
  } catch {
    alert.type = 'error'
    alert.message = '⚠ Registration failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>
