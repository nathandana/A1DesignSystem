// Generated from system/patterns/*.json by scripts/build-patterns.mjs. Do not edit.
export const patternManifests = [
  {
    "schemaVersion": "1.1.0",
    "version": "1.0.0",
    "kind": "pattern",
    "status": "experimental",
    "coverage": {
      "react": true,
      "native": false,
      "pure": false,
      "webComponents": false,
      "figma": false
    },
    "compatibility": {
      "unversioned": "1.0.0",
      "pageSchemaVersions": [
        "0.1.0",
        "1.0.0",
        "1.1.0"
      ]
    },
    "migrations": [],
    "id": "navigation-tree",
    "type": "NavigationTree",
    "name": "Navigation tree",
    "description": "A side navigation tree with optional search and categorized or A–Z views.",
    "propsSchema": {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "type": "object",
      "definitions": {
        "item": {
          "type": "object",
          "required": [
            "id",
            "label"
          ],
          "properties": {
            "id": {
              "type": "string",
              "minLength": 1
            },
            "label": {
              "type": "string",
              "minLength": 1
            },
            "icon": {
              "type": "string"
            },
            "href": {
              "type": "string"
            },
            "category": {
              "type": "boolean"
            },
            "pinned": {
              "type": "boolean"
            },
            "excludeFromAz": {
              "type": "boolean"
            },
            "disabled": {
              "type": "boolean"
            },
            "keywords": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "sortLabel": {
              "type": "string"
            },
            "children": {
              "type": "array",
              "items": {
                "$ref": "#/definitions/item"
              }
            }
          },
          "additionalProperties": true
        }
      },
      "properties": {
        "items": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/item"
          },
          "default": []
        },
        "searchable": {
          "type": "boolean",
          "default": true
        },
        "sortable": {
          "type": "boolean",
          "default": true
        },
        "view": {
          "enum": [
            "tree",
            "az"
          ]
        },
        "defaultView": {
          "enum": [
            "tree",
            "az"
          ]
        },
        "search": {
          "type": "string"
        },
        "defaultSearch": {
          "type": "string"
        },
        "searchLabel": {
          "type": "string"
        },
        "sortLabel": {
          "type": "string"
        },
        "listViewLabel": {
          "type": "string"
        },
        "aria-label": {
          "type": "string"
        },
        "selectedId": {
          "type": [
            "string",
            "null"
          ]
        },
        "defaultSelectedId": {
          "type": [
            "string",
            "null"
          ]
        },
        "expandedIds": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "defaultExpandedIds": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "defaultCollapsed": {
          "type": "boolean",
          "default": false
        },
        "collapsed": {
          "type": "boolean"
        },
        "open": {
          "type": "boolean",
          "default": false
        }
      },
      "additionalProperties": true
    },
    "lockedProps": {
      "placement": "start",
      "collapseButtonPlacement": "footer"
    },
    "areas": [],
    "rules": [
      {
        "id": "navigation-tree-structure",
        "severity": "error"
      }
    ],
    "starter": {
      "props": {
        "items": [],
        "searchable": true,
        "sortable": true,
        "defaultView": "tree",
        "aria-label": "Navigation"
      }
    },
    "examples": [
      {
        "id": "nested",
        "props": {
          "items": [
            {
              "id": "account",
              "label": "Account",
              "category": true,
              "children": [
                {
                  "id": "profile",
                  "label": "Profile",
                  "href": "/profile"
                }
              ]
            }
          ]
        },
        "areas": {}
      }
    ],
    "collections": [
      {
        "id": "items",
        "label": "Navigation items",
        "path": "/props/items",
        "ruleId": "navigation-tree-structure",
        "rules": "Any number of nested categories and items with globally unique IDs and visible labels.",
        "policies": {
          "activation": "selection",
          "uniqueBy": "id",
          "navigation": "safe-target",
          "disabled": "block-activation",
          "children": "children"
        }
      }
    ]
  },
  {
    "schemaVersion": "1.1.0",
    "version": "1.0.0",
    "kind": "pattern",
    "status": "experimental",
    "id": "overflow-menu",
    "type": "OverflowMenu",
    "name": "Overflow menu",
    "description": "A more_vert icon button opens contextual actions. Any action can optionally require verification in a dialog.",
    "coverage": {
      "react": true,
      "native": false,
      "pure": false,
      "webComponents": false,
      "figma": false
    },
    "compatibility": {
      "unversioned": "1.0.0",
      "pageSchemaVersions": [
        "0.1.0",
        "1.0.0",
        "1.1.0"
      ]
    },
    "migrations": [],
    "propsSchema": {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "type": "object",
      "properties": {
        "label": {
          "type": "string",
          "pattern": "\\S"
        },
        "size": {
          "enum": [
            "sm",
            "md",
            "lg"
          ],
          "default": "md"
        },
        "disabled": {
          "type": "boolean",
          "default": false
        },
        "actions": {
          "type": "array",
          "items": {
            "type": "object",
            "required": [
              "id",
              "label"
            ],
            "properties": {
              "id": {
                "type": "string",
                "pattern": "\\S"
              },
              "label": {
                "type": "string",
                "pattern": "\\S"
              },
              "icon": {
                "type": "string"
              },
              "disabled": {
                "type": "boolean"
              },
              "destructive": {
                "type": "boolean"
              },
              "href": {
                "type": "string",
                "pattern": "\\S"
              },
              "verification": {
                "type": "object",
                "required": [
                  "id",
                  "type",
                  "props"
                ],
                "properties": {
                  "id": {
                    "type": "string",
                    "pattern": "\\S"
                  },
                  "type": {
                    "const": "VerificationDialog"
                  },
                  "patternVersion": {
                    "type": "string"
                  },
                  "props": {
                    "type": "object"
                  },
                  "children": {
                    "type": "array"
                  }
                },
                "additionalProperties": true
              }
            },
            "additionalProperties": true
          },
          "default": []
        },
        "onAction": false
      },
      "additionalProperties": true
    },
    "lockedProps": {
      "icon": "more_vert",
      "variant": "tertiary",
      "as": "button"
    },
    "areas": [],
    "collections": [
      {
        "id": "actions",
        "label": "Actions",
        "path": "/props/actions",
        "ruleId": "overflow-menu-actions",
        "rules": "Ordered, uniquely identified menu actions with visible labels. Any action can require verification.",
        "policies": {
          "activation": "optional-verification",
          "uniqueBy": "id",
          "navigation": "safe-target",
          "disabled": "block-activation"
        },
        "patterns": {
          "verification": "VerificationDialog"
        }
      }
    ],
    "rules": [
      {
        "id": "overflow-menu-actions",
        "severity": "error"
      },
      {
        "id": "overflow-menu-verification",
        "severity": "error"
      },
      {
        "id": "overflow-menu-trigger",
        "severity": "error"
      }
    ],
    "starter": {
      "props": {}
    },
    "examples": [
      {
        "id": "edit-duplicate-delete",
        "props": {
          "label": "More actions",
          "actions": [
            {
              "id": "edit",
              "label": "Edit",
              "icon": "edit"
            },
            {
              "id": "duplicate",
              "label": "Duplicate",
              "icon": "content_copy"
            },
            {
              "id": "delete",
              "label": "Delete",
              "icon": "delete",
              "destructive": true,
              "verification": {
                "id": "delete-verification",
                "type": "VerificationDialog",
                "patternVersion": "1.0.0",
                "props": {
                  "title": "Delete item?",
                  "message": "This will delete the selected item.",
                  "confirmLabel": "Delete",
                  "cancelLabel": "Cancel",
                  "destructive": true,
                  "titleKey": "verificationDialog.deleteTitle",
                  "messageKey": "verificationDialog.deleteMessage",
                  "confirmLabelKey": "verificationDialog.delete",
                  "cancelLabelKey": "verificationDialog.cancel"
                },
                "children": [
                  {
                    "id": "delete-verification-content",
                    "type": "Slot",
                    "props": {
                      "area": "content",
                      "label": "Content",
                      "columns": 1,
                      "gap": "sm"
                    }
                  }
                ]
              }
            }
          ]
        },
        "areas": {}
      },
      {
        "id": "verify-duplicate",
        "props": {
          "label": "More actions",
          "actions": [
            {
              "id": "edit",
              "label": "Edit",
              "icon": "edit"
            },
            {
              "id": "duplicate",
              "label": "Duplicate",
              "icon": "content_copy",
              "verification": {
                "id": "duplicate-verification",
                "type": "VerificationDialog",
                "patternVersion": "1.0.0",
                "props": {
                  "title": "Duplicate item?",
                  "message": "This will create a copy of the selected item.",
                  "confirmLabel": "Duplicate",
                  "destructive": false,
                  "titleKey": "verificationDialog.duplicateTitle",
                  "messageKey": "verificationDialog.duplicateMessage",
                  "confirmLabelKey": "verificationDialog.duplicate",
                  "cancelLabelKey": "verificationDialog.cancel"
                },
                "children": [
                  {
                    "id": "duplicate-verification-content",
                    "type": "Slot",
                    "props": {
                      "area": "content",
                      "label": "Content",
                      "columns": 1,
                      "gap": "sm"
                    }
                  }
                ]
              }
            },
            {
              "id": "delete",
              "label": "Delete",
              "icon": "delete",
              "destructive": true
            }
          ]
        },
        "areas": {}
      }
    ]
  },
  {
    "schemaVersion": "1.0.0",
    "version": "1.0.0",
    "kind": "pattern",
    "status": "experimental",
    "coverage": {
      "react": true,
      "native": false,
      "pure": false,
      "webComponents": false,
      "figma": false
    },
    "compatibility": {
      "unversioned": "1.0.0",
      "pageSchemaVersions": [
        "0.1.0",
        "1.0.0",
        "1.1.0"
      ]
    },
    "migrations": [
      {
        "from": "unversioned",
        "to": "1.0.0",
        "operations": [
          {
            "op": "renameProp",
            "from": "facts",
            "to": "details"
          },
          {
            "op": "adoptAreas"
          }
        ]
      }
    ],
    "id": "overview-card",
    "type": "OverviewCard",
    "name": "Overview card",
    "description": "A parent-sized summary card with details, open content and constrained actions.",
    "propsSchema": {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "type": "object",
      "required": [
        "title"
      ],
      "properties": {
        "title": {
          "type": "string"
        },
        "icon": {
          "type": "string"
        },
        "titleAs": {
          "enum": [
            "h2",
            "h3",
            "h4"
          ],
          "default": "h3"
        },
        "status": {
          "enum": [
            "neutral",
            "info",
            "success",
            "warn",
            "error"
          ]
        },
        "statusLabel": {
          "type": "string"
        },
        "details": {
          "type": "array",
          "maxItems": 6,
          "items": {
            "type": "object",
            "required": [
              "label",
              "value"
            ],
            "properties": {
              "label": {
                "type": "string"
              },
              "value": {
                "type": [
                  "string",
                  "number"
                ]
              }
            }
          }
        }
      },
      "additionalProperties": true
    },
    "lockedProps": {
      "as": "div",
      "variant": "default",
      "surface": "default",
      "bare": false,
      "statusPulse": false,
      "iconDisplay": "default"
    },
    "areas": [
      {
        "id": "content",
        "label": "Content",
        "hint": "Between the details and the actions — a short paragraph, a progress bar or a chart.",
        "placement": "after:details",
        "kind": "open",
        "destination": "children",
        "layout": {
          "columns": 1,
          "gap": "sm"
        }
      },
      {
        "id": "actions",
        "label": "Actions",
        "hint": "The card actions, at the end of the card.",
        "placement": "after:content",
        "kind": "zone",
        "destination": "actions",
        "allow": [
          "Button",
          "Link",
          "IconButton"
        ],
        "max": 2,
        "count": "direct-items",
        "ruleId": "overview-card-no-primary-action",
        "rules": "Up to 2 small buttons, links or icon buttons. No primary button: cards repeat, and the page title holds the primary action.",
        "policies": {
          "fixedProps": {
            "Button": {
              "size": "sm"
            },
            "IconButton": {
              "size": "sm"
            }
          },
          "variants": {
            "Button": {
              "allow": [
                "secondary",
                "tertiary"
              ],
              "fallback": "secondary"
            },
            "IconButton": {
              "allow": [
                "secondary",
                "tertiary"
              ],
              "fallback": "tertiary"
            }
          }
        }
      }
    ],
    "rules": [
      {
        "id": "overview-card-no-primary-action",
        "severity": "error"
      },
      {
        "id": "overview-card-locked-presentation",
        "severity": "error"
      },
      {
        "id": "overview-card-status-labelled",
        "severity": "warning"
      },
      {
        "id": "overview-card-short-details",
        "severity": "error"
      },
      {
        "id": "overview-card-parent-width",
        "severity": "error"
      }
    ],
    "starter": {
      "props": {
        "title": "Overview",
        "icon": "account_circle",
        "details": [
          {
            "label": "Status",
            "value": "Active"
          },
          {
            "label": "Owner",
            "value": "Team name"
          },
          {
            "label": "Updated",
            "value": "Today"
          }
        ]
      }
    },
    "examples": [
      {
        "id": "with-content",
        "props": {
          "title": "Account overview",
          "details": [
            {
              "label": "Plan",
              "value": "Enterprise"
            }
          ]
        },
        "areas": {
          "content": [
            {
              "id": "summary",
              "type": "Paragraph",
              "content": {
                "fallback": "Your account summary."
              }
            }
          ],
          "actions": [
            {
              "id": "billing",
              "type": "Link",
              "props": {
                "href": "/billing"
              },
              "content": {
                "fallback": "Billing history"
              }
            },
            {
              "id": "more",
              "type": "IconButton",
              "props": {
                "icon": "more_horiz",
                "label": "Account options",
                "variant": "tertiary",
                "size": "sm"
              }
            }
          ]
        }
      }
    ]
  },
  {
    "schemaVersion": "1.0.0",
    "version": "1.0.0",
    "kind": "pattern",
    "status": "experimental",
    "coverage": {
      "react": true,
      "native": false,
      "pure": false,
      "webComponents": false,
      "figma": false
    },
    "compatibility": {
      "unversioned": "1.0.0",
      "pageSchemaVersions": [
        "0.1.0",
        "1.0.0",
        "1.1.0"
      ]
    },
    "migrations": [
      {
        "from": "unversioned",
        "to": "1.0.0",
        "operations": [
          {
            "op": "adoptAreas"
          }
        ]
      }
    ],
    "id": "page-title",
    "type": "PageTitle",
    "name": "Page title",
    "description": "The standard page heading band with metadata, actions and open content.",
    "propsSchema": {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "type": "object",
      "required": [
        "title"
      ],
      "properties": {
        "title": {
          "type": "string"
        },
        "eyebrow": {
          "type": "string"
        },
        "description": {
          "type": "string"
        },
        "titleId": {
          "type": "string"
        },
        "backLabel": {
          "type": "string"
        },
        "contentWidth": {
          "enum": [
            "xs",
            "sm",
            "md",
            "lg",
            "xl",
            "2xl"
          ],
          "default": "xl"
        },
        "breadcrumb": {
          "anyOf": [
            {
              "type": "boolean"
            },
            {
              "type": "array",
              "items": {
                "type": "object",
                "required": [
                  "label"
                ],
                "properties": {
                  "label": {
                    "type": "string"
                  },
                  "href": {
                    "type": "string"
                  }
                }
              }
            }
          ]
        }
      },
      "additionalProperties": true
    },
    "lockedProps": {
      "as": "header",
      "padding": "xs",
      "surface": "panel",
      "borderSize": "sm",
      "borderVariant": "accent",
      "borderSides": "bottom"
    },
    "areas": [
      {
        "id": "meta",
        "label": "Metadata",
        "hint": "Badges about the page, directly below the title.",
        "placement": "after:title",
        "kind": "zone",
        "destination": "meta",
        "allow": [
          "MessageBadge"
        ],
        "max": 5,
        "count": "direct-items",
        "ruleId": "page-title-metadata-below-title",
        "rules": "Up to 5 badges, shown small and subtle directly below the title.",
        "policies": {
          "fixedProps": {
            "MessageBadge": {
              "size": "sm",
              "subtle": true
            }
          }
        }
      },
      {
        "id": "actions",
        "label": "Actions",
        "hint": "The page actions, after the description.",
        "placement": "after:description",
        "kind": "zone",
        "destination": "actions",
        "allow": [
          "Button",
          "Link",
          "IconButton",
          "ButtonContainer",
          "Toolbar",
          "SegmentedControl"
        ],
        "max": 4,
        "count": "direct-items",
        "ruleId": "page-title-allowed-actions",
        "rules": "Up to 4 buttons, split buttons, links, icon buttons, button groups, toolbars or segmented controls. One primary button, shown last.",
        "policies": {
          "ordering": "primary-last",
          "primary": {
            "types": [
              "Button",
              "SplitButton"
            ],
            "defaultVariant": "primary",
            "max": 1,
            "overflowVariant": "secondary"
          },
          "groups": {
            "ButtonContainer": [
              "Button",
              "Link",
              "IconButton",
              "ButtonContainer"
            ]
          },
          "variants": {
            "IconButton": {
              "allow": [
                "tertiary",
                "secondary",
                "destructive",
                "success"
              ],
              "fallback": "tertiary"
            }
          }
        }
      },
      {
        "id": "content",
        "label": "Content",
        "hint": "Below the actions. Add a search field, tabs or filters.",
        "placement": "after:actions",
        "kind": "open",
        "destination": "children",
        "layout": {
          "columns": 1,
          "gap": "sm"
        }
      }
    ],
    "rules": [
      {
        "id": "page-title-allowed-actions",
        "severity": "error"
      },
      {
        "id": "page-title-metadata-below-title",
        "severity": "error"
      },
      {
        "id": "page-title-one-primary-action-last",
        "severity": "warning"
      }
    ],
    "starter": {
      "props": {
        "title": "Page title",
        "breadcrumb": true,
        "description": "A short description tells people what this page is for."
      }
    },
    "examples": [
      {
        "id": "with-content",
        "props": {
          "title": "Projects",
          "description": "Manage your projects."
        },
        "areas": {
          "meta": [
            {
              "id": "status",
              "type": "MessageBadge",
              "props": {
                "status": "success"
              },
              "content": {
                "fallback": "Active"
              }
            }
          ],
          "actions": [
            {
              "id": "create",
              "type": "Button",
              "props": {
                "variant": "primary"
              },
              "content": {
                "fallback": "Create project"
              }
            },
            {
              "id": "help",
              "type": "Link",
              "props": {
                "href": "/help"
              },
              "content": {
                "fallback": "Help"
              }
            }
          ],
          "content": [
            {
              "id": "intro",
              "type": "Paragraph",
              "content": {
                "fallback": "Choose a project to continue."
              }
            }
          ]
        }
      }
    ]
  },
  {
    "schemaVersion": "1.0.0",
    "version": "1.0.0",
    "kind": "pattern",
    "status": "experimental",
    "id": "verification-dialog",
    "type": "VerificationDialog",
    "name": "Verification dialog",
    "description": "Verify an action with a consequence message, optional content, Cancel and Confirm.",
    "coverage": {
      "react": true,
      "native": false,
      "pure": false,
      "webComponents": false,
      "figma": false
    },
    "compatibility": {
      "unversioned": "1.0.0",
      "pageSchemaVersions": [
        "0.1.0",
        "1.0.0",
        "1.1.0"
      ]
    },
    "migrations": [],
    "propsSchema": {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "type": "object",
      "required": [
        "title",
        "message"
      ],
      "properties": {
        "title": {
          "type": "string",
          "pattern": "\\S"
        },
        "message": {
          "type": "string",
          "pattern": "\\S"
        },
        "confirmLabel": {
          "type": "string",
          "pattern": "\\S"
        },
        "cancelLabel": {
          "type": "string",
          "pattern": "\\S"
        },
        "destructive": {
          "type": "boolean"
        },
        "disabled": {
          "type": "boolean"
        },
        "open": {
          "type": "boolean"
        },
        "onConfirm": false,
        "onClose": false,
        "titleKey": {
          "type": "string",
          "pattern": "\\S",
          "description": "Optional label-service key. The corresponding text prop is the fallback."
        },
        "messageKey": {
          "type": "string",
          "pattern": "\\S",
          "description": "Optional label-service key. The corresponding text prop is the fallback."
        },
        "confirmLabelKey": {
          "type": "string",
          "pattern": "\\S",
          "description": "Optional label-service key. The corresponding text prop is the fallback."
        },
        "cancelLabelKey": {
          "type": "string",
          "pattern": "\\S",
          "description": "Optional label-service key. The corresponding text prop is the fallback."
        }
      },
      "additionalProperties": true
    },
    "lockedProps": {
      "size": "sm"
    },
    "areas": [
      {
        "id": "content",
        "label": "Content",
        "hint": "Optional supporting details between the message and the actions.",
        "kind": "open",
        "destination": "children",
        "placement": "after:message",
        "layout": {
          "columns": 1,
          "gap": "sm"
        }
      }
    ],
    "rules": [
      {
        "id": "verification-dialog-confirmation",
        "severity": "error"
      },
      {
        "id": "verification-dialog-focus",
        "severity": "error"
      }
    ],
    "starter": {
      "props": {
        "title": "Confirm action?",
        "message": "Review this action before continuing."
      }
    },
    "examples": [
      {
        "id": "delete-item",
        "props": {
          "title": "Delete item?",
          "message": "This will delete the selected item.",
          "confirmLabel": "Delete",
          "destructive": true,
          "titleKey": "verificationDialog.deleteTitle",
          "messageKey": "verificationDialog.deleteMessage",
          "confirmLabelKey": "verificationDialog.delete"
        },
        "areas": {}
      }
    ]
  }
];
