!(function (_) {
  (_.__JS_ERROR__ = []),
    (_.onerror = function () {
      _.__JS_ERROR__.push(Array.prototype.slice.call(arguments));
    });
})(window);
!(function (r) {
  const t = {
      homepage: "mobtk",
      viewjob: "mobvjtk",
      viewjobJapan: "mobvjtk",
      serp: "mobtk",
      serpJapan: "mobtk",
    },
    n = {
      homepage: "hp",
      viewjob: "vj",
      viewjobJapan: "vjjp",
      serp: "srch",
      serpJapan: "srchjp",
    },
    p = function (e) {
      return t[e];
    },
    d = function (e) {
      return n[e];
    },
    c = function () {
      var e = r.devicePixelRatio || 1,
        e =
          '"pixelRatio":' +
          e +
          ',"scrWidth":' +
          Math.floor(r.screen.width * e) +
          ',"scrHeight":' +
          Math.floor(r.screen.height * e);
      return (
        r.screen.orientation &&
          (e +=
            ',"scrOrientation":"' +
            (-1 < r.screen.orientation.type.indexOf("portrait")
              ? "portrait"
              : "landscape") +
            '"'),
        e
      );
    };
  r.logPageLoadInfo = function (e, t, n) {
    if (Image) {
      var o = d(e),
        a = p(e);
      if (o && a) {
        t =
          ((a = t),
          '"eventName":"mobPageLoadInfo","type":"mobPageLoadInfo","pageId":"' +
            (t = e) +
            '","' +
            p(t) +
            '":"' +
            a +
            '","pageName":"' +
            d(t) +
            '"');
        n && r.screen && (t += "," + c());
        t =
          "/m/rpc/frontendlogging?logType=trackEvent&moduleName=event&application=indeedmobile&pageId=" +
          e +
          "&data=" +
          encodeURIComponent("{" + t + "}").replace(/%20/g, "+");
        const i = new Image();
        (i.src = t),
          (i.height = i.width = 0),
          (i.height = i.width = 1),
          (i.style.display = "none"),
          (i.ariaHidden = !0),
          (i.alt = " "),
          i.setAttribute("aria-hidden", "true"),
          document.body.appendChild(i);
      }
    }
  };
})(window);
window.logPageLoadInfo("viewjob", "1hb474f61lel6801", true);
!(function (r) {
  function t(t) {
    for (var e = t.target; e && e !== r.documentElement; ) {
      if ("A" === e.tagName) {
        var n = e.getAttribute("data-href");
        return void (
          null !== n &&
          (e.setAttribute("href", n), e.removeAttribute("data-href"))
        );
      }
      e = e.parentNode;
    }
  }
  r.addEventListener &&
    ("ontouchstart" in r
      ? r.addEventListener("touchstart", t)
      : r.addEventListener("mousedown", t));
})(document);
window._initialData = {
  "accountKey": "bcca090f34a62c52",
  "additionalLinksViewModel": {
    "careerGuideArticleLinks": [],
    "nearbyLocationLinks": [],
    "similarCategoryLinks": [],
    "similarJobTitleLinks": [],
  },
  "apiPaths": {},
  "apolloCachedResponse": [
    {
      "queryDocument":
        'query getViewJobJobData($jobKey: ID!, $shouldQueryJobTitle: Boolean!, $shouldQueryJobData: Boolean!, $shouldQuerySavedJob: Boolean!, $shouldQueryTitleNorm: Boolean!, $shouldQueryCompanyFields: Boolean!, $shouldQuerySalary: Boolean!, $shouldQueryIndeedApplyLink: Boolean!, $shouldQueryParentEmployer: Boolean!, $mobvjtk: String) { jobData(input: {jobKeys: [$jobKey]}) { __typename results { __typename job { __typename key ...JobTitle @include(if: $shouldQueryJobTitle) ...jobDataFields @include(if: $shouldQueryJobData) ...titleNormFields @include(if: $shouldQueryTitleNorm) ...companyFields @include(if: $shouldQueryCompanyFields) ...parentEmployerFields @include(if: $shouldQueryParentEmployer) compensation @include(if: $shouldQuerySalary) { __typename key } indeedApply @include(if: $shouldQueryIndeedApplyLink) { __typename applyLink(property: INDEED, trackingKeys: {mobvjtk: $mobvjtk}) { __typename url iaUid } } } } } savedJobsByKey(keys: [$jobKey]) @include(if: $shouldQuerySavedJob) { __typename state currentStateTime } } fragment JobTitle on Job { __typename title } fragment jobDataFields on Job { __typename title sourceEmployerName datePublished expired language normalizedTitle refNum source { __typename key name } feed { __typename key isDradis feedSourceType } url dateOnIndeed description { __typename html text } location { __typename countryCode admin1Code admin2Code admin3Code admin4Code city postalCode latitude longitude streetAddress formatted { __typename long short } } occupations { __typename key label } jobTypes: attributes(customClass: "BM62A") { __typename key label } indeedApply { __typename key scopes } attributes { __typename key label } hiringDemand { __typename isUrgentHire isHighVolumeHiring } thirdPartyTrackingUrls jobSearchMobileMigrationData { __typename advertiserId applyEmail applyUrl contactEmail contactPhone isNoUniqueUrl urlRewriteRule mapDisplayType jobTags locCountry tpiaAdvNum tpiaApiToken tpiaCoverLetter tpiaEmail tpiaFinishAppUrl tpiaJobCompanyName tpiaJobId tpiaJobLocation tpiaJobMeta tpiaJobTitle tpiaLocale tpiaName tpiaPhone tpiaPostUrl tpiaPresent tpiaResume tpiaResumeFieldsOptional tpiaResumeFieldsRequired tpiaScreenerQuestions iaVisibility } } fragment titleNormFields on Job { __typename normalizedTitle displayTitle } fragment companyFields on Job { __typename employer { __typename name key tier relativeCompanyPageUrl dossier { __typename images { __typename rectangularLogoUrl headerImageUrls { __typename url1960x400 } squareLogoUrls { __typename url256 } } } ugcStats { __typename globalReviewCount ratings { __typename overallRating { __typename count value } } } } } fragment parentEmployerFields on Job { __typename employer { __typename subsidiaryOptOutStatus parentEmployer { __typename name subsidiaryOptOutStatus } } }',
      "responseData": {
        "jobData": {
          "__typename": "JobDataPayload",
          "results": [
            {
              "__typename": "JobDataResult",
              "job": {
                "__typename": "Job",
                "key": "4330f1d7b672f4cb",
                "title": "Senior Engineer, Java, Store Digital",
                "employer": {
                  "__typename": "Employer",
                  "subsidiaryOptOutStatus": false,
                  "parentEmployer": null,
                },
              },
            },
          ],
        },
      },
      "variables": {
        "jobKey": "4330f1d7b672f4cb",
        "shouldQueryJobTitle": true,
        "shouldQueryJobData": false,
        "shouldQuerySavedJob": false,
        "shouldQueryTitleNorm": false,
        "shouldQueryCompanyFields": false,
        "shouldQuerySalary": false,
        "shouldQueryIndeedApplyLink": false,
        "shouldQueryParentEmployer": true,
        "mobvjtk": "1hb474f61lel6801",
      },
    },
  ],
  "appCommonData": null,
  "applyButtonSDKEnabled": true,
  "autoClickApply": false,
  "base64EncodedJson":
    "eyJjIjp0cnVlLCJlIjp0cnVlLCJnIjoiaHR0cDovL3d3dy5pbmRlZWQuY29tL3ZpZXdqb2I_ams9NDMzMGYxZDdiNjcyZjRjYiIsImgiOiJTZW5pb3IgRW5naW5lZXIsIEphdmEsIFN0b3JlIERpZ2l0YWwiLCJpIjoiU2FuIEZyYW5jaXNjbywgQ0EgOTQxMDUiLCJqIjoib3JnYW5pYyJ9",
  "baseInboxUrl": "https:\u002F\u002Finbox.indeed.com",
  "baseUrl": "https:\u002F\u002Fwww.indeed.com",
  "benefitsModel": {
    "benefits": [
      { "key": "FVKX2", "label": "401(k)" },
      { "key": "6XHWW", "label": "Commuter assistance" },
      { "key": "FQJ2X", "label": "Dental insurance" },
      { "key": "CFRGS", "label": "Disability insurance" },
      { "key": "SXFZX", "label": "Employee discount" },
      { "key": "G85UP", "label": "Flexible spending account" },
      { "key": "EY33Q", "label": "Health insurance" },
      { "key": "Y2WS5", "label": "Life insurance" },
      { "key": "HW4J4", "label": "Paid time off" },
      { "key": "YDH5H", "label": "Referral program" },
      { "key": "RZAT2", "label": "Vision insurance" },
    ],
    "benefitsCollapseThreshold": 7,
  },
  "callToInterviewButtonModel": null,
  "categorizedAttributesModel": null,
  "chatbotApplyButtonLinkModel": null,
  "clientsideProctorGroups": {
    "collapsedJobDescription": false,
    "isMosaicJobDetailsActive": false,
    "showJobLocationBelowJD": false,
    "splitRender": false,
    "showSalaryGuide": true,
    "callToApplyStickyBelowApplyNow": false,
    "isVjLabelUpdateTestActive": false,
    "isShiftRollupModuleActive": false,
    "clearResetString": true,
    "simpleVJImprove": false,
    "isJsViewjobJobdetailsImproveSubheaderActive": true,
    "simple2Pane": true,
    "richerAppPromoV4": false,
    "richerAppPromoV3": false,
    "callToApplyStickySideBySide": false,
    "connectionNavigator": false,
    "richerAppPromoV5": false,
    "richerAppPromoV2": false,
    "richerAppPromoV1": false,
    "addSaveButtonBack": true,
    "toastOnVJFromDC": false,
    "mobVJBenefits": true,
    "oneGraphMigrationTitle": true,
    "isConnectionNavigatorCallPrimary": true,
    "hideJobDetialsForExpiredJobs": true,
    "showJobLocationAboveJD": false,
    "desktopvj_stickyheader_tst": false,
    "callButtonPrimaryApplySecondary": false,
  },
  "cmiJobCategoryModel": null,
  "collapsedDescriptionPayload": {
    "click": 0,
    "descriptionHeight": "10rem",
    "isDisclaimerAboveApply": false,
  },
  "commuteInfoModel": null,
  "companyAvatarModel": null,
  "companyFollowFormModel": null,
  "companyTabModel": null,
  "contactPersonModel": null,
  "country": "US",
  "cssResetProviders": {
    "mosaic-provider-reportcontent": false,
    "js-match-insights-provider": false,
    "MosaicProviderCallToApplyFeedback": true,
    "mosaic-providers-high-quality-marketplace-job-seeker-opt-in": true,
  },
  "ctk": "1evehh85lu2la800",
  "dcmModel": { "category": "jobse0", "source": "6927552", "type": "organic" },
  "desktop": true,
  "dgToken": "94C1F57E9F60F2588E6663F37F676763",
  "dislikeFrom2paneEnabled": true,
  "downloadAppButtonModel": null,
  "dsanr": false,
  "employerResponsiveCardModel": null,
  "from": null,
  "globalnavFooterHTML": "",
  "globalnavHeaderHTML": "",
  "highQualityMarketplace": {
    "connectUrl": null,
    "headingContentGroup": 2,
    "match": false,
    "messageCtaOverride": null,
    "optedIn": false,
    "rebrand": true,
    "showEmployerDetails": null,
    "showMessagingFirstExperience": null,
    "token": null,
  },
  "highQualityMarketplaceHiringManager": null,
  "hiringInsightsModel": {
    "age": "6 days ago",
    "employerLastReviewed": null,
    "employerResponsiveCardModel": null,
    "numOfCandidates": null,
    "postedToday": false,
    "recurringHireText": null,
    "urgentlyHiringModel": null,
  },
  "indeedApplyButtonContainer": null,
  "indeedLogoModel": { "showLogoWithKatakana": false, "size": "lg" },
  "inlineJsErrEnabled": false,
  "isApp": false,
  "isApplyTextColorChanges": true,
  "isApplyTextSizeChanges": true,
  "isCriOS": false,
  "isDislikeFormV2Enabled": true,
  "isSafariForIOS": false,
  "isSalaryNewDesign": false,
  "isSyncJobs": false,
  "jasJobViewPingModel": null,
  "jasxInputWhatWhereActive": true,
  "jobAlertSignInModalModel": null,
  "jobAlertSignUp": null,
  "jobCardStyleModel": {
    "fontSizeEnlarged": false,
    "highContrastIconShown": false,
    "jobCardShelfApplied": false,
    "salaryBlack": false,
    "shouldMarkClickedJobAsVisited": false,
  },
  "jobInfoWrapperModel": {
    "jobInfoModel": {
      "appliedStateBannerModel": null,
      "commuteInfoModel": null,
      "expiredJobMetadataModel": null,
      "hideCmpHeader": false,
      "isSmbD2iEnabled": false,
      "jobDebugInfoModel": null,
      "jobDescriptionSectionModel": {
        "acmeMicrocontentSurveyUrl": "https:\u002F\u002Fcocos-api.indeed.com",
        "isViewJobMismatchBadgeLoggingEnabled": false,
        "jobDetailsSection": {
          "contents": {},
          "highlightedAttributesSectionModels": null,
          "interactivePreferenceCollectionTst": 8,
          "isJobDetailPreferenceCollectionEnabled": true,
          "isJobDetailsShiftPreferenceCollectionEnabled": true,
          "isJobExpired": true,
          "isMinimumPayPreferenceEnabled": true,
          "isMobPreferenceMatchVJActive": true,
          "isMobSalaryTextActive": true,
          "isMobVJSimpleJobDetailsActive": false,
          "isPreferenceMismatchBanIconEnabled": true,
          "isSimpleVJImproveActive": false,
          "isVJPreferencesDataCollectionActive": false,
          "isVJPreferencesGroupingsActive": true,
          "isVJPreferencesHighlightedAttributesActive": false,
          "isVJPreferencesUiGroupingsActive": false,
          "jobTypes": [
            {
              "customClassLabels": [],
              "customClassSuids": [],
              "label": "Full-time",
              "sentiment": "UNKNOWN",
              "suid": "CF3CP",
            },
          ],
          "knownUserSentimentIdMap": {
            "6XQ9P": ["11ED620AD22F8D009D3E576703B8EBA6"],
            "9A4FB": ["11ED620AD22F65DE9D3E576703B8EBA6"],
            "8QFQV": ["11ED620AD22FB4139D3E576703B8EBA6"],
            "CTESF": ["11ED620AD22F8CFC9D3E576703B8EBA6"],
            "R6S96": ["11ED620AD22F8CFE9D3E576703B8EBA6"],
            "3YQ8V": ["11ED620AD22F3EC29D3E576703B8EBA6"],
            "ZBEAD": ["11ED620AD22F65E19D3E576703B8EBA6"],
            "QE236": ["11ED620AD22F8CFA9D3E576703B8EBA6"],
            "PP4CH": ["PP4CH"],
            "PFTHH": ["11ED620AD22F3EC39D3E576703B8EBA6"],
            "SAP7A": ["SAP7A"],
            "MG5WY": ["MG5WY"],
            "TRYDN": ["TRYDN"],
            "8PA9N": ["8PA9N"],
            "99B7P": ["11ED620AD22F8CF79D3E576703B8EBA6"],
            "B36JD": ["B36JD"],
            "YSDFB": ["YSDFB"],
            "C8Z84": ["11ED620AD22F65DD9D3E576703B8EBA6"],
            "D3N7S": ["11ED620AD22F65D99D3E576703B8EBA6"],
            "SVWFF": ["11ED620AD22F65DC9D3E576703B8EBA6"],
            "FQMG4": ["FQMG4"],
            "YR77W": ["11ED620AD22F3EC49D3E576703B8EBA6"],
            "XA6MB": ["11ED620AD22FB4149D3E576703B8EBA6"],
            "SJ2HN": ["SJ2HN"],
            "HJSX6": ["HJSX6"],
            "H98DC": ["11ED620AD22F3EC79D3E576703B8EBA6"],
            "7SRRR": ["7SRRR"],
            "Y7U37": ["11ED620AD22F8CF89D3E576703B8EBA6"],
            "CCJPX": ["11ED620AD22F65D89D3E576703B8EBA6"],
            "QAJH8": ["11ED620AD22F8D019D3E576703B8EBA6"],
            "XQCWP": ["11ED620AD22F8CFF9D3E576703B8EBA6"],
            "PAGS7": ["11ED620AD22F3EC19D3E576703B8EBA6"],
            "84K74": ["11ED620AD22F8CFB9D3E576703B8EBA6"],
            "KYZ6U": ["11ED620AD22F8CF99D3E576703B8EBA6"],
            "VK2NN": ["11ED620AD22F3EC59D3E576703B8EBA6"],
            "JE22R": ["11ED620AD22F65DB9D3E576703B8EBA6"],
            "92P73": ["11ED620AD22F8CF59D3E576703B8EBA6"],
            "NMAVY": ["11ED620AD22F65E09D3E576703B8EBA6"],
            "CH5MX": ["CH5MX"],
            "CF3CP": ["681bfb1c-ec5d-407c-ac65-f473d42cc3dc"],
            "9S4WX": ["11ED620AD22FB4129D3E576703B8EBA6"],
            "GVCUK": ["11ED620AD22F65DA9D3E576703B8EBA6"],
            "RY9MK": ["11ED620AD22F8CFD9D3E576703B8EBA6"],
            "MABSK": ["MABSK"],
            "NTT75": ["11ED620AD22F65DF9D3E576703B8EBA6"],
            "PPS22": ["11ED620AD22F3EC69D3E576703B8EBA6"],
            "DN4N2": ["11ED620AD22F8CF29D3E576703B8EBA6"],
            "K5RQ3": ["11ED620AD22F8CF69D3E576703B8EBA6"],
            "JB2WC": ["11ED620AD22FB4159D3E576703B8EBA6"],
            "S2JZM": ["S2JZM"],
            "NHSY5": ["11ED620AD22F8CF39D3E576703B8EBA6"],
            "F5XFG": ["11ED620AD22F8CF49D3E576703B8EBA6"],
          },
          "minimumPayPreferenceTst": 2,
          "salaryInfoModel": null,
          "segmentPreferences": [],
          "shifts": [],
          "shiftsAndSchedule": null,
          "title": "Job details",
        },
        "order": ["JOB_DETAILS", "QUALIFICATIONS"],
        "qualificationsSectionModel": null,
      },
      "jobInfoHeaderModel": {
        "a11yNewtabIconActive": true,
        "companyImagesModel": {
          "ejiBannerAsBackground": false,
          "enhancedJobDescription": false,
          "featuredEmployer": false,
          "headerImageUrl": null,
          "logoAltText": "Sephora logo",
          "logoImageOverlayLower": false,
          "logoUrl": null,
          "showBannerTop": false,
          "showEnhancedJobImp": false,
          "showIconInTitle": false,
        },
        "companyName": "Sephora",
        "companyOverviewLink": null,
        "companyReviewLink": null,
        "companyReviewModel": null,
        "employerActivity": null,
        "employerResponsiveCardModel": null,
        "encryptedFccCompanyId": null,
        "formattedLocation": "San Francisco, CA 94105",
        "hideRating": false,
        "isDesktopApplyButtonSticky": true,
        "isSimpleVjImproveActive": false,
        "isSimplifiedHeader": false,
        "jobNormTitle": null,
        "jobTitle": "Senior Engineer, Java, Store Digital",
        "jobTypes": null,
        "location": null,
        "mobileStickyVjHeaderActive": false,
        "openCompanyLinksInNewTab": true,
        "parentCompanyName": null,
        "preciseLocationModel": null,
        "ratingsModel": null,
        "recentSearch": null,
        "remoteLocation": false,
        "remoteWorkModel": null,
        "salaryCurrency": null,
        "salaryMax": null,
        "salaryMin": null,
        "salaryType": null,
        "subtitle": "Sephora - San Francisco, CA 94105",
        "tagModels": null,
        "taxonomyAttributes": null,
        "viewJobDisplay": "DESKTOP_STANDALONE",
        "workplaceInsightsModel": null,
      },
      "jobMetadataHeaderModel": { "jobType": "Full-time" },
      "jobTagModel": null,
      "resumeEvaluationResult": null,
      "sanitizedJobDescription":
        "<div>\n <p><b>Job ID:<\u002Fb> 232256<br> <b>Location Name:<\u002Fb> FSC REMOTE SF\u002FNY\u002FDC -173(USA_0173)<br> <b>Address:<\u002Fb> FSC, Remote, CA 94105, United States (US)<br> <b>Job Type:<\u002Fb> Full Time<br> <b>Position Type:<\u002Fb> Regular<br> <b>Job Function:<\u002Fb> Information Technology<br> <b>Remote Eligible:<\u002Fb>Yes<\u002Fp>\n <p><\u002Fp>\n <p><b><br> Company Overview:<\u002Fb><\u002Fp>\n <p> At Sephora we inspire our customers, empower our teams, and help them become the best versions of themselves. We create an environment where people are valued, and differences are celebrated. Every day, our teams across the world bring to life our purpose: to expand the way the world sees beauty by empowering the Extra Ordinary in each of us. We are united by a common goal - to <b>reimagine the future of beauty<\u002Fb>.<\u002Fp>\n <p><\u002Fp>\n <p><b><br> The Opportunity:<\u002Fb><\u002Fp>\n <p><b> Technology<\u002Fb><\u002Fp>\n <p> Our technology team works fast and smart. With San Francisco as our home, we take bringing new tech to market seriously, developing the latest in java microservice technologies, scalable architecture, and the coolest in-store client experience. We love what we do and we have fun doing it. The Technology group is comprised of motivated self-starters and true team players that are absolutely integral to the growth of Sephora and our future success.<\u002Fp>\n <p><\u002Fp>\n <p><b><br> Your role at Sephora: <\u002Fb><\u002Fp>\n <p>As a Senior Java Engineer, you will be responsible for the ownership and evolution of our microservices. Reporting to the Manager, Store Digital Applications, you will work closely with other engineering, design, and product management teams, to both deliver on the roadmap and our plan for the future. In addition, you will: <\u002Fp>\n <ul>\n  <li>Own and evolve the java microservice architecture. Success in this area means making the right decisions that are both what’s best for the long-term health of our applications and what’s best for the customer.<\u002Fli>\n  <li> Collaborating with 10+ engineers to create and execute the architectural plan.<\u002Fli>\n  <li> Sharing and communicating best practices from your career and creating news ones with the team.<\u002Fli>\n  <li> Lead and influence a team of 10+ engineers<\u002Fli>\n  <li> Provide technical leadership: Guide or scale the engineering team through your expertise in technical writing, distributed systems architecture, coding, operational excellence and software development processes.<\u002Fli>\n  <li> Partner closely with product, user experience, and upper management, translating the benefits of the team’s work into a language that is understood by all.<\u002Fli>\n  <li> Deliver well instrumented systems that provide insight in Operational Metrics and helps resolving issues<\u002Fli>\n  <li> Demonstrate our Sephora values of Passion for Client Service, Innovation, Expertise, Balance, Respect for All, Teamwork, and Initiative.<\u002Fli>\n <\u002Ful>\n <p><\u002Fp>\n <p><b><br> We’re excited about you if you have: <\u002Fb><\u002Fp>\n <ul>\n  <li>6+ years of hands-on experience in building customer-focused, java base software products with a focus on backend services and APIs<\u002Fli>\n  <li> Self-motivated, highly organized, team player who thrives in a fast-paced environment with the ability to learn quickly and work independently<\u002Fli>\n  <li> Proficiency in java and expert in microservice architecture<\u002Fli>\n  <li> Experience in Designing and architecting microservice based java applications<\u002Fli>\n  <li> Experience developing and delivering using Agile methodologies<\u002Fli>\n  <li> Experience building, shipping, and maintaining reliable and scalable backend services on a public cloud platform preferably Azure <\u002Fli>\n  <li>Able to both identify and improve poor performing code or database queries<\u002Fli>\n  <li> Experience and a strong opinion about unit testing, code review, CI\u002FCD<\u002Fli>\n  <li> Understanding of software architecture, engineering principles, design patterns, object-oriented-programming(OOP), frameworks and technologies<\u002Fli>\n  <li> Strong communication skills (oral, verbal and listening) as well as the ability to influence the broader engineering team and understand their points of view<\u002Fli>\n  <li> Bachelor’s Degree in Computer Science (or a related field) and \u002F or equivalent experience.<\u002Fli>\n <\u002Ful>\n <p><\u002Fp>\n <p><b><br> You’ll love working here because: <\u002Fb><\u002Fp>\n <ul>\n  <li>The people. You will be surrounded by some of the most talented, supportive, smart, and kind leaders and teams – people you can be proud to work with. <\u002Fli>\n  <li>The product. Employees enjoy a product discount and receive free product (“gratis”) various times throughout the year. (Think your friends and family love you now? Just wait until you work at Sephora!)<\u002Fli>\n  <li> The business. It feels good to win – and Sephora is a leader in the retail industry, defining experiential retail with a digital focus and creating the most loved beauty community in the world…with the awards and accolades to back it up. <\u002Fli>\n  <li>The perks. Sephora offers comprehensive medical benefits, generous vacation\u002Fholiday time off, commuter benefits, and “Summer Fridays” (half-days every Friday between Memorial and Labor Day)…and so much more.<\u002Fli>\n  <li> The LVMH family. Sephora’s parent company, LVMH, is one of the largest luxury groups in the world, providing support to over 70 brands such as Louis Vuitton, Celine, Marc Jacobs, and Dior.<\u002Fli>\n <\u002Ful>\n <p><br> <\u002Fp>\n <p><b>Working at Sephora’s Field Support Center (FSC)<\u002Fb><\u002Fp>\n <p> Our North American operations are based in the heart of San Francisco’s Financial District, but you won’t hear us call it a headquarters – it’s the Field Support Center (FSC). At the FSC, we support our stores in providing the best possible experience for every client. Dedicated teams cater to our client’s every need by creating covetable assortments, curated content, compelling storytelling, smart strategy, skillful analysis, expert training, and more. It takes a lot of curious and confident individuals, disrupting the status quo and taking chances. The pace is fast, the fun is furious, and the passion is real. We never rest on our laurels. Our motto? If it’s not broken, fix it.<\u002Fp>\n <p><\u002Fp>\n <p><b><br> Sephora is an equal opportunity employer and values diversity at our company<\u002Fb>. We do not discriminate on the basis of race, religion, color, national origin, ancestry, citizenship, gender, gender identity, sexual orientation, age, marital status, military\u002Fveteran status, or disability status. Sephora is committed to working with and providing reasonable accommodation to applicants with physical and mental disabilities.<\u002Fp>\n <p><br> <\u002Fp>\n <p>Sephora will consider for employment all qualified applicants with criminal histories in a manner consistent with applicable law.<\u002Fp>\n <p><\u002Fp>\n <p><br> The annual base salary range for this position is $164,000.00 - $181,000.00 The actual base salary offered depends on a variety of factors, which may include, as applicable, the applicant’s qualifications for the position; years of relevant experience; specific and unique skills; level of education attained; certifications or other professional licenses held; other legitimate, non-discriminatory business factors specific to the position; and the geographic location in which the applicant lives and\u002For from which they will perform the job. Individuals employed in this position may also be eligible to earn bonuses. Sephora offers a generous benefits package to full-time employees, which includes comprehensive health, dental and vision plans; a superior 401(k) plan, various paid time off programs; employee discount\u002Fperks; life insurance; disability insurance; flexible spending accounts; and an employee referral bonus program.<\u002Fp>\n <p><\u002Fp>\n <p><b><br> While at Sephora, you’ll enjoy…<\u002Fb><\u002Fp>\n <p><\u002Fp>\n <ul>\n  <li><b><br> The people. <\u002Fb>You will be surrounded by some of the most talented leaders and teams – people you can be proud to work with.<\u002Fli>\n  <li><b> The learning<\u002Fb>. We invest in training and developing our teams, and you will continue evolving and building your skills through personalized career plans.<\u002Fli>\n  <li><b> The culture<\u002Fb>. As a leading beauty retailer within the LVMH family, our reach is broad, and our impact is global. It is in our DNA to innovate and, at Sephora, all 40,000 passionate team members across 35 markets and 3,000+ stores, are united by a common goal - to reimagine the future of beauty.<\u002Fli>\n <\u002Ful>\n <p><\u002Fp>\n <p><br> You can <b>unleash your creativity<\u002Fb>, because we’ve got disruptive spirit. You can <b>learn and evolve<\u002Fb>, because we empower you to be your best. You can <b>be yourself<\u002Fb>, because you are what sets us apart. <b><i>This<\u002Fi><\u002Fb><b>, is the future of beauty. Reimagine your future, at Sephora.<\u002Fb><\u002Fp>\n <p><\u002Fp>\n <p><b><br> Sephora is an equal opportunity employer and values diversity at our company.<\u002Fb> We do not discriminate on the basis of race, religion, color, national origin, ancestry, citizenship, gender, gender identity, sexual orientation, age, marital status, military\u002Fveteran status, or disability status. Sephora is committed to working with and providing reasonable accommodation to applicants with physical and mental disabilities.<\u002Fp>\n <p><\u002Fp>\n <p><br> Sephora will consider for employment all qualified applicants with criminal histories in a manner consistent with applicable law.<\u002Fp>\n<\u002Fdiv>",
      "screenerRequirementsModel": null,
      "showExpiredHeader": true,
      "tagModels": null,
      "viewJobDisplay": "DESKTOP_STANDALONE",
    },
    "sectionedJobInfoModel": null,
  },
  "jobKey": "4330f1d7b672f4cb",
  "jobLocation": "San Francisco, CA 94105",
  "jobMetadataFooterModel": {
    "age": "6 days ago",
    "indeedApplyAdaNotice": null,
    "isShowJapanSafeJobSearchGuidelinesDisclaimer": false,
    "originalJobLink": {
      "dataHref": null,
      "href":
        "https:\u002F\u002Fwww.indeed.com\u002Fapplystart?jk=4330f1d7b672f4cb&from=vj&pos=top&mvj=0&spon=0&sjdu=YmZE5d5THV8u75cuc0H6Y26AwfY51UOGmh3Z9h4OvXj5lzXpatrYmd9yYiMe1aRUXAwdulcUk0atwlDdDDqlBQ&astse=ef9909de90ad31b1&assa=4617",
      "openInNewTab": true,
      "referrerpolicy": "origin",
      "rel": "noopener",
      "target": "_blank",
      "text": "original job",
      "title": null,
    },
    "phoneNumber": null,
    "saveJobLink": null,
    "showReportJobAsButton": true,
    "source": "Sephora",
  },
  "jobSeenData": "tk=1hb474f61lel6801&context=viewjobrecs",
  "jobTitle": "Senior Engineer, Java, Store Digital",
  "language": "en",
  "lastVisitTime": 1695100851,
  "lazyProviders": {
    "mosaic-provider-reportcontent":
      '<div class="mosaic-reportcontent-wrapper button"><style data-emotion="css 16q8vsx">.css-16q8vsx{box-sizing:border-box;background:none;-webkit-appearance:none;-moz-appearance:none;-ms-appearance:none;appearance:none;text-align:left;-webkit-text-decoration:none;text-decoration:none;border:none;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-ms-flex-pack:center;-webkit-justify-content:center;justify-content:center;position:relative;margin:0;padding-left:1rem;padding-right:1rem;line-height:1.5;font-family:"Noto Sans","Helvetica Neue","Helvetica","Arial","Liberation Sans","Roboto","Noto",sans-serif;font-size:1rem;font-weight:700;border-radius:0.5rem;border-width:1px;border-style:solid;-webkit-transition:border-color 200ms cubic-bezier(0.645, 0.045, 0.355, 1),background-color 200ms cubic-bezier(0.645, 0.045, 0.355, 1),opacity 200ms cubic-bezier(0.645, 0.045, 0.355, 1),box-shadow 200ms cubic-bezier(0.645, 0.045, 0.355, 1),color 200ms cubic-bezier(0.645, 0.045, 0.355, 1);transition:border-color 200ms cubic-bezier(0.645, 0.045, 0.355, 1),background-color 200ms cubic-bezier(0.645, 0.045, 0.355, 1),opacity 200ms cubic-bezier(0.645, 0.045, 0.355, 1),box-shadow 200ms cubic-bezier(0.645, 0.045, 0.355, 1),color 200ms cubic-bezier(0.645, 0.045, 0.355, 1);display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;width:auto;padding-top:0.5625rem;padding-bottom:0.5625rem;color:#2d2d2d;border-color:#e4e2e0;background-color:#e4e2e0;}.css-16q8vsx::-moz-focus-inner{border:0;}@media (prefers-reduced-motion: reduce){.css-16q8vsx{-webkit-transition:none;transition:none;}}.css-16q8vsx:disabled{opacity:0.4;pointer-events:none;}.css-16q8vsx:focus{outline:none;box-shadow:0 0 0 0.125rem #ffffff,0 0 0 0.1875rem #2557a7;}.css-16q8vsx:focus:not([data-focus-visible-added]){box-shadow:none;}.css-16q8vsx[aria-disabled=\'true\']{cursor:default;}.css-16q8vsx:visited{color:#2d2d2d;}.css-16q8vsx:hover:not([aria-disabled=\'true\']){border-color:#d4d2d0;background-color:#d4d2d0;}.css-16q8vsx:active:not([aria-disabled=\'true\']){box-shadow:inset 0 0.125rem 0.25rem rgba(45, 45, 45, 0.2),inset 0 0.0625rem 0.1875rem rgba(45, 45, 45, 0.12),inset 0 0 0.125rem rgba(45, 45, 45, 0.2);border-color:#b4b2b1;background-color:#b4b2b1;}.css-16q8vsx[aria-disabled=\'true\']{border:transparent;background-color:rgba(228,226,224,0.4);color:rgba(45,45,45,0.4);}<\u002Fstyle><button class="mosaic-reportcontent-button desktop css-16q8vsx e8ju0x51"><span class="mosaic-reportcontent-button-icon"><\u002Fspan>Report job<\u002Fbutton><div class="mosaic-reportcontent-content"><\u002Fdiv><\u002Fdiv>',
    "js-match-insights-provider": "",
    "MosaicProviderCallToApplyFeedback": "",
    "mosaic-providers-high-quality-marketplace-job-seeker-opt-in": "",
  },
  "locale": "en_US",
  "localeData": {
    "": [
      null,
      "Project-Id-Version: \nReport-Msgid-Bugs-To: \nPOT-Creation-Date: 2023-09-12 00:31-0500\nPO-Revision-Date: 2022-10-21 16:25+0000\nLast-Translator: Auto Generated <noreply@indeed.com>\nLanguage-Team: English (United States) <https:\u002F\u002Fweblate.corp.indeed.com\u002Fprojects\u002Findeed\u002Findeedmobile-i18n-content\u002Fen_US\u002F>\nLanguage: en_US\nMIME-Version: 1.0\nContent-Type: text\u002Fplain; charset=UTF-8\nContent-Transfer-Encoding: 8bit\nPlural-Forms: nplurals=2; plural=n != 1;\nX-Generator: Weblate 3.9.1\n",
    ],
    "iphone_home_find_jobs\u0004Find Jobs": [null, "Find Jobs"],
    "iphone_home_location_caption_capitalized\u0004City, state, or zip code": [
      null,
      'City, state, zip code, or "remote"',
    ],
    "mobVJJobDetailsPreferenceMatchShift\u0004Shift & Schedule": [
      null,
      "Shift and Schedule",
    ],
  },
  "loggedIn": true,
  "mobResourceTimingEnabled": false,
  "mobtk": "1hb474f61lel6801",
  "mosaicData": null,
  "oneGraphApiKey":
    "db7ac28c69eff9413df48909e55558cf4bf371590d8bef3165e4facbb7277a39",
  "oneGraphApiUrl": "https:\u002F\u002Fapis.indeed.com\u002Fgraphql\u002F",
  "originalJobLinkModel": {
    "a11yNewtabIconActive": true,
    "cookieName": "RCLK",
    "cookiePath": "\u002F",
    "cookieValue":
      "jk=4330f1d7b672f4cb&vjtk=1hb474f61lel6801&ts=1695580044481&rd=&qd=",
  },
  "pageId": "viewjob",
  "parenttk": null,
  "phoneLinkType": null,
  "preciseLocationModel": null,
  "profileBaseUrl": "https:\u002F\u002Fprofile.indeed.com",
  "queryString": null,
  "recentQueryString":
    "q1=happy lemon&l1=united states&r1=-1&q2=software engineer&r2=-1&q3=software&r3=-1",
  "recommendedJobsModel": { "decreaseSpacing": false, "shouldShow": false },
  "recommendedSearchesModel": {
    "recommendedSearches": [],
    "shouldShow": false,
  },
  "relatedLinks": [
    {
      "href": "\u002Fq-senior-java-developer-l-san-francisco,-ca-jobs.html",
      "linkText": "Senior Java Developer jobs in San Francisco, CA",
      "what": "Senior Java Developer",
      "where": "San Francisco, CA",
    },
    {
      "href": "\u002Fq-sephora-l-san-francisco,-ca-jobs.html",
      "linkText": "Jobs at Sephora in San Francisco, CA",
      "what": "Sephora",
      "where": "San Francisco, CA",
    },
    {
      "href": "\u002Fsalary?q1=Senior+Java+Developer&l1=San+Francisco%2C+CA",
      "linkText": "Senior Java Developer salaries in San Francisco, CA",
      "what": "Senior Java Developer",
      "where": "San Francisco, CA",
    },
  ],
  "requestPath": "\u002Fviewjob?jk=4330f1d7b672f4cb",
  "resumeFooterModel": null,
  "resumePromoCardModel": null,
  "rtl": false,
  "salaryGuideModel": {
    "acmeMicrocontentEndpoint": "https:\u002F\u002Fcocos-api.indeed.com",
    "country": "US",
    "estimatedSalaryModel": null,
    "formattedLocation": "San Francisco, CA",
    "jobKey": "4330f1d7b672f4cb",
    "language": "en",
  },
  "salaryInfoModel": null,
  "saveJobButtonContainerModel": null,
  "saveJobFailureModalModel": {
    "closeAriaLabel": "Close",
    "closeButtonText": "Close",
    "message": "Please retry",
    "signInButtonText": null,
    "signInHref": null,
    "title": "Failed to Save Job",
  },
  "saveJobLimitExceededModalModel": {
    "closeAriaLabel": "Close",
    "closeButtonText": null,
    "message": "You reached the limit. Please log in to save additional jobs.",
    "signInButtonText": "Sign in",
    "signInHref":
      "https:\u002F\u002Fsecure.indeed.com\u002Faccount\u002Flogin?co=US&hl=en_US&continue=http%3A%2F%2Fwww.indeed.com%2Fviewjob%3Fjk%3D4330f1d7b672f4cb&from=viewjob_savejoblimitmodal",
    "title": "You've already saved 20 jobs",
  },
  "segmentId": "food_servers",
  "segmentPhoneNumberButtonLinkModel": null,
  "shareJobButtonContainerModel": {
    "buttonIconModel": {
      "color": "blue",
      "position": null,
      "size": "md",
      "title": "Share this job",
      "type": "\u002Fm\u002Fimages\u002Fnativeshare.svg",
    },
    "buttonModel": {
      "buttonSize": null,
      "buttonType": "secondary",
      "children": "Share this job",
      "disabled": false,
      "href": null,
      "isActive": false,
      "isBlock": false,
      "isResponsive": false,
      "size": "md",
    },
    "fallbackButtonIconModel": {
      "color": "blue",
      "position": null,
      "size": "md",
      "title": "Copy link",
      "type": "\u002Fm\u002Fimages\u002Ficon-copy.svg",
    },
    "shareText":
      "Check out this job on Indeed:\nSephora\nSenior Engineer, Java, Store Digital\nSan Francisco, CA 94105\nhttps:\u002F\u002Fwww.indeed.com\u002Fm\u002Fviewjob?jk=4330f1d7b672f4cb&from=native",
    "shareType": "native",
    "shareUrl":
      "https:\u002F\u002Fwww.indeed.com\u002Fm\u002Fviewjob?jk=4330f1d7b672f4cb&from=native",
    "showUnderSaveButton": true,
  },
  "shouldLogResolution": true,
  "shouldShowConditionalBackButton": false,
  "showEmployerResponsiveCard": false,
  "showGlobalNavContent": true,
  "showReportInJobButtons": false,
  "sponsored": false,
  "staticPrefix": "\u002F\u002Fc03.s3.indeed.com\u002Fm\u002Fs\u002F",
  "stickyType": "ALWAYS",
  "successfullySignedInModel": null,
  "thirdPartyAndMobile": false,
  "thirdPartyQuestionsToggle": false,
  "viewJobButtonLinkContainerModel": null,
  "viewJobDisplay": "DESKTOP_STANDALONE",
  "viewJobDisplayParam": "dtsa",
  "viewjobDislikes": false,
  "whatWhereFormModel": { "wherePrefill": "United States" },
  "workplaceInsightsModel": null,
  "zoneProviders": {
    "aboveViewjobButtons": [],
    "viewjobModals": ["MosaicProviderCallToApplyFeedback"],
    "aboveExtractedJobDescription": [],
    "rightRail": [],
    "aboveFullJobDescription": [],
    "betweenJobDescriptionAndButtons": [],
    "legacyProvidersViewJob": ["mosaic-provider-reportcontent"],
    "ssrVJModals": [],
    "belowJobDescription": [],
    "belowFullJobDescription": [],
    "belowVJButtonsAndRightRail": [],
    "belowViewjobNav": [],
    "belowViewjobButtons": [
      "mosaic-providers-high-quality-marketplace-job-seeker-opt-in",
    ],
  },
};
